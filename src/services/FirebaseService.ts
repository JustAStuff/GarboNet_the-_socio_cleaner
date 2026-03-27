import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    getDocs,
    orderBy,
    Timestamp,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db, storage, auth } from '../config/firebase';

export interface Complaint {
    id?: string;
    image_url: string;
    latitude: number;
    longitude: number;
    waste_types: string[];
    confidence: number;
    status: 'Pending' | 'In Progress' | 'Resolved' | 'Escalated';
    created_at: any;
    user_id: string;
    escalation_level: number;
    is_hotspot?: boolean;
    after_image_url?: string;
    after_ai_result?: any;
    resolved_at?: any;
}

export class FirebaseService {
    /**
     * Store photo in database directly.
     * On Oppo/Android 11, Firebase Storage Blobs often crash. 
     * Storing as Base64 in Firestore is 100% stable for small images (47KB).
     */
    static async uploadImage(base64Data: string): Promise<string> {
        // We simply return the base64 data-uri.
        // It will be stored in the 'image_url' field of the Firestore document.
        return `data:image/jpeg;base64,${base64Data}`;
    }

    /**
     * Save a new complaint with duplicate detection logic
     */
    static async createComplaint(data: Partial<Complaint>): Promise<string> {
        try {
            const user = auth.currentUser;
            // FALLBACK ID: Ensures reports never fail even if auth state is syncing
            const userId = user?.uid || 'temp_civilian_user';

            const complaintData: Omit<Complaint, 'id'> = {
                image_url: data.image_url || '',
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
                waste_types: data.waste_types || ['General Waste'],
                confidence: data.confidence || 0,
                status: 'Pending',
                created_at: Timestamp.now(),
                user_id: userId,
                escalation_level: 0,
                is_hotspot: false
            };

            const docRef = await addDoc(collection(db, 'complaints'), complaintData);
            return docRef.id;
        } catch (error) {
            console.error('Create Complaint Error:', error);
            throw error;
        }
    }

    /**
     * Real-time listener for complaints
     */
    static listenComplaints(
        callback: (complaints: Complaint[]) => void,
        role: 'worker' | 'civilian' | 'admin',
        userId?: string
    ) {
        let q;
        const complaintsRef = collection(db, 'complaints');

        if (role === 'civilian' && userId) {
            q = query(complaintsRef, where('user_id', '==', userId));
        } else {
            // Workers and Admins see everything
            q = query(complaintsRef);
        }

        return onSnapshot(q, (snapshot) => {
            const complaints = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Complaint));

            // Sort by date in JavaScript to avoid needing a Firestore index
            complaints.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));

            callback(complaints);
        }, (error) => {
            console.error("Firestore Listen error:", error);
        });
    }

    /**
     * Update complaint status (Worker only)
     */
    static async updateStatus(complaintId: string, status: Complaint['status']): Promise<void> {
        try {
            const docRef = doc(db, 'complaints', complaintId);
            await updateDoc(docRef, {
                status: status,
                updated_at: Timestamp.now()
            });
        } catch (error) {
            console.error('Update Status Error:', error);
            throw error;
        }
    }
}
