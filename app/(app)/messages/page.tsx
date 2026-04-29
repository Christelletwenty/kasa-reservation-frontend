"use client";

import { getStoredUserId } from "@/app/lib/auth-guard";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUserById } from "../../lib/users-api";
import styles from "./Message.module.css";
import Link from "next/link";
import { User } from "@/app/types/users";
import { BACKEND_URL } from "@/app/lib/config";

// Type représentant une conversation dans la liste de gauche.
type Conversation = {
  id: number;
  userId: number;
  preview: string;
  time: string;
  unread?: boolean;
};

// Type représentant un message dans une conversation.
type Message = {
  id: number;
  sender: "other" | "me";
  text: string;
  time: string;
  date?: string;
};

// Données temporaires simulant des conversations.
// Plus tard, ces données pourront venir d'une API.
const mockConversations: Conversation[] = [
  {
    id: 1,
    userId: 3,
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
    unread: true,
  },
  {
    id: 2,
    userId: 1,
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
    unread: true,
  },
  {
    id: 3,
    userId: 5,
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
  {
    id: 4,
    userId: 2,
    preview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    time: "11:04 am",
  },
];

// Objet qui stocke les messages par id de conversation.
// Exemple : la conversation 1 contient une liste de messages.
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
  const [usersById, setUsersById] = useState<Record<number, User>>({});
  // Référence vers le conteneur HTML qui affiche les messages.
  // On l'utilise pour scroller automatiquement vers le bas.
  const messagesBodyRef = useRef<HTMLDivElement | null>(null);
  // Stocke les messages par conversation.
  // On initialise avec les messages mockés.
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<number, Message[]>
  >(mockMessagesByConversation);

  // Recherche la conversation actuellement sélectionnée.
  const selectedConversation = mockConversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  // Récupère les messages de la conversation sélectionnée.
  // Si aucun message n'existe encore pour cette conversation, on retourne un tableau vide.
  const messages = messagesByConversation[selectedConversationId] ?? [];

  useEffect(() => {
    const loadUsers = async () => {
      // On récupère tous les ids utilisateurs présents dans les conversations.
      // Set permet d'éviter les doublons.
      const uniqueUserIds = [
        ...new Set(
          mockConversations.map((conversation) => conversation.userId),
        ),
      ];

      // On ajoute aussi l'utilisateur connecté, car on doit afficher son nom/avatar
      // dans les messages envoyés par "me".
      if (currentUserId) {
        uniqueUserIds.push(currentUserId);
      }

      // On garde uniquement les utilisateurs qui ne sont pas déjà chargés.
      const missingUserIds = uniqueUserIds.filter((id) => !usersById[id]);

      // Si tous les utilisateurs sont déjà en mémoire, on ne fait rien.
      if (missingUserIds.length === 0) {
        return;
      }

      const users = await Promise.all(
        missingUserIds.map((id) => getUserById(id)),
      );

      // On met à jour usersById sans écraser les utilisateurs déjà présents.
      setUsersById((previous) => {
        const next = { ...previous };

        for (const user of users) {
          next[user.id] = user;
        }

        return next;
      });
    };

    // Le "void" indique qu'on ignore volontairement la Promise retournée.
    void loadUsers();
  }, [usersById, currentUserId]);

  useEffect(() => {
    // Dès qu'on change de conversation ou que les messages changent,
    // on scroll automatiquement tout en bas de la zone de messages.
    if (messagesBodyRef.current) {
      messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
    }
  }, [selectedConversationId, messages]);

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, on le redirige vers la page login.
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  function sendMessage() {
    // On retire les espaces inutiles au début et à la fin du message.
    const trimmedMessage = message.trim();

    // Si le message est vide, on arrête la fonction.
    if (!trimmedMessage) {
      return;
    }

    // Création du nouveau message envoyé par l'utilisateur connecté.
    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      text: trimmedMessage,
      time: "À l'instant",
    };

    // On ajoute le message dans la conversation sélectionnée.
    setMessagesByConversation((previous) => ({
      ...previous,
      [selectedConversationId]: [
        ...(previous[selectedConversationId] ?? []),
        newMessage,
      ],
    }));

    // On vide le textarea après l'envoi.
    setMessage("");

    // Simulation d'une réponse automatique après 1,5 seconde.
    // Plus tard, cette partie pourra être remplacée par une vraie API ou du temps réel.
    setTimeout(() => {
      const replyMessage: Message = {
        id: Date.now() + 1,
        sender: "other",
        text: "Oui !",
        time: "À l'instant",
      };

      setMessagesByConversation((previous) => ({
        ...previous,
        [selectedConversationId]: [
          ...(previous[selectedConversationId] ?? []),
          replyMessage,
        ],
      }));
    }, 1500);
  }

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
              <div className={styles.avatarPlaceholder}>
                {usersById[conversation.userId]?.picture ? (
                  <img
                    src={`${usersById[conversation.userId].picture!.startsWith("http") ? "" : BACKEND_URL}${usersById[conversation.userId].picture!}`}
                    alt=""
                  />
                ) : (
                  ""
                )}
              </div>

              <div className={styles.conversationContent}>
                <div className={styles.conversationTopRow}>
                  <h2 className={styles.conversationUserName}>
                    {usersById[conversation.userId]?.name ?? "Chargement..."}
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
        <div ref={messagesBodyRef} className={styles.messagesBody}>
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
                        <div className={styles.messageAvatar}>
                          {usersById[selectedConversation.userId]?.picture ? (
                            <img
                              src={`${usersById[selectedConversation.userId].picture!.startsWith("http") ? "" : BACKEND_URL}${usersById[selectedConversation.userId].picture!}`}
                              alt=""
                            />
                          ) : (
                            ""
                          )}
                        </div>

                        <div className={styles.messageContent}>
                          <div className={styles.messageMeta}>
                            <span className={styles.messageAuthor}>
                              {usersById[selectedConversation.userId]?.name}
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
                              {usersById[currentUserId]?.name}
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

                        <div className={styles.messageAvatar}>
                          {usersById[currentUserId]?.picture ? (
                            <img
                              src={`${usersById[currentUserId].picture!.startsWith("http") ? "" : BACKEND_URL}${usersById[currentUserId].picture!}`}
                              alt=""
                            />
                          ) : (
                            ""
                          )}
                        </div>
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
            aria-label="Envoyer un message"
            className={styles.messageInput}
            placeholder="Envoyer un message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <button
            type="button"
            className={styles.sendButton}
            onClick={() => sendMessage()}
          >
            ↑
          </button>
        </form>
      </section>
    </div>
  );
}
