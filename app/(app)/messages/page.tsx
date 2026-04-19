"use client";

import { getStoredUserId } from "@/app/lib/auth-guard";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Message.module.css";
import Link from "next/link";

type Conversation = {
  id: number;
  userName: string;
  preview: string;
  time: string;
  unread?: boolean;
};

type Message = {
  id: number;
  sender: "other" | "me";
  text: string;
  time: string;
  date?: string;
};

const mockConversations: Conversation[] = [
  {
    id: 1,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
    unread: true,
  },
  {
    id: 2,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
    unread: true,
  },
  {
    id: 3,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
  {
    id: 4,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
  {
    id: 5,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
  {
    id: 6,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
  {
    id: 7,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
  {
    id: 8,
    userName: "Utilisateur",
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
];

const mockMessagesByConversation: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: "other",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04pm",
    },
    {
      id: 2,
      sender: "other",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04pm",
    },
    {
      id: 3,
      sender: "me",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04pm",
    },
    {
      id: 4,
      sender: "other",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04pm",
      date: "03 Septembre 2025",
    },
    {
      id: 5,
      sender: "me",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04pm",
    },
    {
      id: 6,
      sender: "other",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04pm",
    },
  ],
};

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostId = searchParams.get("hostId");
  const currentUserId = getStoredUserId();
  const isLoggedIn = currentUserId !== null;

  const selectedConversation = mockConversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const messages = mockMessagesByConversation[selectedConversationId] ?? [];

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return <div>Redirection vers la page de connexion...</div>;
  }

  return (
    <div className={styles.messagesPage}>
      <section className={styles.messagesSidebar}>
        <div className={styles.messagesSidebarHeader}>
          <Link href="/properties" className={styles.backButton}>
            ← Retour
          </Link>

          <h1 className={styles.title}>Messages</h1>
        </div>

        <div className={styles.conversationsList}>
          {mockConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`${styles.conversationCard} ${
                selectedConversationId === conversation.id
                  ? styles.conversationCardActive
                  : ""
              }`}
              onClick={() => setSelectedConversationId(conversation.id)}
            >
              <div className={styles.avatarPlaceholder} />

              <div className={styles.conversationContent}>
                <div className={styles.conversationTopRow}>
                  <h2 className={styles.conversationUserName}>
                    {conversation.userName}
                  </h2>
                  <span className={styles.conversationTime}>
                    {conversation.time}
                  </span>
                </div>

                <div className={styles.conversationBottomRow}>
                  <p className={styles.conversationPreview}>
                    {conversation.preview}
                  </p>
                  {conversation.unread ? (
                    <span className={styles.unreadDot} />
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.messagesContent}>
        <div className={styles.messagesBody}>
          {selectedConversation ? (
            messages.map((msg, index) => {
              const showDateSeparator =
                msg.date &&
                (index === 0 || messages[index - 1].date !== msg.date);

              return (
                <div key={msg.id}>
                  {showDateSeparator ? (
                    <div className={styles.dateSeparator}>
                      <span className={styles.dateSeparatorLine} />
                      <span className={styles.dateSeparatorText}>
                        {msg.date}
                      </span>
                      <span className={styles.dateSeparatorLine} />
                    </div>
                  ) : null}

                  <div
                    className={`${styles.messageRow} ${
                      msg.sender === "me"
                        ? styles.messageRowMe
                        : styles.messageRowOther
                    }`}
                  >
                    {msg.sender === "other" ? (
                      <>
                        <div className={styles.messageAvatar} />

                        <div className={styles.messageContent}>
                          <div className={styles.messageMeta}>
                            <span className={styles.messageAuthor}>
                              Utilisateur
                            </span>
                            <span className={styles.messageDot}>•</span>
                            <span className={styles.messageTime}>
                              {msg.time}
                            </span>
                          </div>

                          <div className={styles.messageBubbleOther}>
                            {msg.text}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.messageContentMe}>
                          <div className={styles.messageMetaMe}>
                            <span className={styles.messageAuthor}>
                              Utilisateur
                            </span>
                            <span className={styles.messageDot}>•</span>
                            <span className={styles.messageTime}>
                              {msg.time}
                            </span>
                          </div>

                          <div className={styles.messageBubbleMe}>
                            {msg.text}
                          </div>
                        </div>

                        <div className={styles.messageAvatar} />
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              Sélectionne une conversation pour afficher les messages.
            </div>
          )}
        </div>

        <form className={styles.messageComposer}>
          <textarea
            className={styles.messageInput}
            placeholder="Envoyer un message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <button type="submit" className={styles.sendButton}>
            ↑
          </button>
        </form>
      </section>
    </div>
  );
}
