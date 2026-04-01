import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from "../types";

export async function createTicket(
  userId: string,
  data: {
    title: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
  },
) {
  return addDoc(collection(db, "tickets"), {
    userId,
    ...data,
    status: "open" as TicketStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToUserTickets(
  userId: string,
  callback: (tickets: Ticket[]) => void,
): () => void {
  const q = query(collection(db, "tickets"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
        } as Ticket;
      }),
    );
  });
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  const q = query(collection(db, "tickets"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    } as Ticket;
  });
}
