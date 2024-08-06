import React, { useState, useEffect } from "react";
import { db, authent } from "@/FirebaseCred";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/ui/SearchBar";

interface Partner {
  name: string;
  lastMessageTimestamp: any;
}

const ChatPartnersPage: React.FC = () => {
  const [chatPartners, setChatPartners] = useState<Partner[]>([]);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      onAuthStateChanged(authent, async (user) => {
        if (user) {
          try {
            const userID = user.uid;
            const userDoc = doc(db, "userData", userID);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.userName) {
                setUserName(data.userName);
                fetchChatPartners(data.userName);
              }
            } else {
              console.log("No such document in userData collection!");
            }
          } catch (error) {
            console.error("Error getting user document:", error);
          }
        } else {
          console.error("No user is signed in.");
        }
      });
    };

    const fetchChatPartners = async (currentUserName: string) => {
      try {
        const chatsCollection = collection(db, "chats");
        const chatDocsSnapshot = await getDocs(chatsCollection);

        if (chatDocsSnapshot.empty) {
          console.log("No chats found in the collection.");
          return;
        }

        const partners: Partner[] = [];

        for (const chatDoc of chatDocsSnapshot.docs) {
          const chatDocId = chatDoc.id;
          const usernames = chatDocId.split("_");

          if (usernames.includes(currentUserName)) {
            const partnerName = usernames.find(
              (name) => name !== currentUserName
            );
            if (partnerName) {
              const messagesCollection = collection(
                db,
                "chats",
                chatDocId,
                "messages"
              );
              const latestMessageQuery = query(
                messagesCollection,
                orderBy("timestamp", "desc"),
                limit(1)
              );
              const latestMessageSnapshot = await getDocs(latestMessageQuery);
              const latestMessageDoc = latestMessageSnapshot.docs[0];

              if (latestMessageDoc) {
                const lastMessageTimestamp = latestMessageDoc.data().timestamp;
                partners.push({ name: partnerName, lastMessageTimestamp });
              }
            }
          }
        }

        partners.sort(
          (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
        );
        setChatPartners(partners);
      } catch (error) {
        console.error("Error fetching chat partners:", error);
      }
    };

    getUserData();
  }, []);

  const navigateToChat = (partnerName: string) => {
    navigate("/chatpage", { state: { username2: partnerName } });
  };

  return (
    <div className="p-4">
      <SearchBar />
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <ul>
        {chatPartners.map((partner, index) => (
          <li
            key={index}
            className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-300"
            onClick={() => navigateToChat(partner.name)}
          >
            {partner.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatPartnersPage;
