"use server"

import { 
    BUCKET_ID, 
    DATABASE_ID, 
    ENDPOINT, 
    PATIENT_COLLECTION_ID, 
    PROJECT_ID, 
    storage, 
    users,
    databases 
} from "../appwrite.config"
import { InputFile } from "node-appwrite/file"
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"

//Create Appwrite user
export const createUser = async(user: CreateUserParams)=>{
     try{
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log({newUser})
     } catch(error:any){
        if(error && error?.code === 409){
            const documents = await users.list([
                Query.equal('email',[user.email])
            ])

            return documents?.users[0]
        }
        console.error("An error occurred while creating a new user:", error);
     }
}

export const getUser = async(userId: string) =>{
    try{
        const user = await users.get(userId);

        return parseStringify(user);
    }catch(error){
        console.log(error)
    }
}

export const getPatient = async(userId: string) =>{
    try{
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [
                Query.equal('userId', userId)
            ]
        );

        return parseStringify(patients.documents[0]);
    }catch(error){
        console.log(error)
    }
}

export const registerPatient = async ({ identificationDocument, ...patient}: RegisterUserParams) =>{
    try {
        let file;

        if(identificationDocument){
            // Create input file from the document
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            // Upload file and await the response
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
            
            // Verify file was created successfully
            if (!file || !file.$id) {
                throw new Error('Failed to upload identification document');
            }
        }

    
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )
        return parseStringify(newPatient);
    } catch (error) {
        console.log(error);
    }
}