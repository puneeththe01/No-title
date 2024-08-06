import React, { useState, useEffect } from "react";
import { db, authent } from "@/FirebaseCred";
import {
  collection,
  setDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: any;
}

interface ChatPageProps {
  username2?: string;
}

const ChatPage: React.FC<ChatPageProps> = () => {
  const location = useLocation();
  const { username2 } = (location.state || {}) as ChatPageProps;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUserData = async () => {
      onAuthStateChanged(authent, async (user) => {
        if (user) {
          try {
            const userID = user.uid;
            const userDoc = doc(db, "userData", userID);
            const docSnap = await getDoc(userDoc);

            if (!docSnap.exists()) {
              console.log("No such document!");
              return;
            }

            const data = docSnap.data();
            Object.entries(data).forEach(([key, value]) => {
              if (key === "userName") {
                setUserName(value as string);
              }
            });
          } catch (error) {
            console.error("Error getting document:", error);
          }
        } else {
          console.error("No user is signed in.");
        }
      });
    };

    getUserData();
  }, []);

  const generateChatId = (userId1: string, userId2: string): string => {
    const ids = [userId1, userId2].sort();
    return `${ids[0]}_${ids[1]}`;
  };

  const currentUserId = userName;
  const chatWithUserId = username2 || "defaultUser"; // Provide a fallback if username2 is not available

  const chatId = generateChatId(currentUserId, chatWithUserId);

  useEffect(() => {
    console.log(`Fetching messages for chatId: ${chatId}`);

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data() as Message);
      });
      console.log(`Retrieved messages: `, messages);
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      // Create or update the document with the specified chatId
      const chatDocRef = doc(db, "chats", chatId);

      await setDoc(chatDocRef, {}, { merge: true }); // Ensure the chat document exists

      await setDoc(
        doc(db, "chats", chatId, "messages", new Date().toISOString()),
        {
          senderId: currentUserId,
          receiverId: chatWithUserId,
          message: newMessage,
          timestamp: new Date(),
        }
      );

      console.log("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.senderId === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 flex">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-4 p-2 bg-blue-500 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      <span className="mb-20">Nothing down</span>
    </div>
  );
};

export default ChatPage;
