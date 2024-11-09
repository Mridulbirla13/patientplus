"use client"

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {Form, FormControl} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";


const RegisterForm = ({ user }: { user: User }) =>  {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name:"",
      email:"",
      phone:""
    },
  });


  const onSubmit= async(values: z.infer<typeof PatientFormValidation>)=> {
    setisLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0){
        const blobFile = new Blob([values.identificationDocument[0]],{
            type: values.identificationDocument[0].type,
        })

        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name)
    }
    try{
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

      //@ts-ignore
      const patient = await registerPatient(patientData);

      if(patient){
        router.push(`/patients/${user.$id}/new-appointment`)
      }
    } catch(error){
      console.log(error);
    }

    setisLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
          <section className="space-y-4">
            <h1 className="header">Welcome👋</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
            </div>            
          </section>
          
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name = "name"
            label="Full Name"
            placeholder = "Mridul Birla"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "email"
              label = "Email"
              placeholder = "mridulbirla@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="user"
            />

            <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name = "phone"
            label = "Phone Number"
            placeholder = "987 654 3210"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name = "birthdate"
              label = "Date of Birth"
            />

            <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name = "gender"
            label = "Gender"
            renderSkeleton={(field)=>(
                <FormControl>
                    <RadioGroup 
                        className="flex h-11 gap-6 xl:justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        {GenderOptions.map((option)=>(
                            <div key={option}
                            className="radio-group">
                                <RadioGroupItem value={option} id={option}/>
                                <Label htmlFor={option}
                                className="cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FormControl>
            )}/>
            
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "address"
              label = "Address"
              placeholder = "39th Avenue, Seattle, USA"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "occupation"
              label = "Occupation"
              placeholder = "Software Engineer"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "emergencyContactName"
              label = "Emergency contact name"
              placeholder = "Guardian's name"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name = "emergencyContactNumber"
              label = "Emergency contact number"
              placeholder = "ex: +91 987 654 3210"
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
            </div>            
          </section>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name = "primaryPhysician"
            label="Primary physician"
            placeholder = "Select a physician"
          >
            {Doctors.map((doctor)=>(
                <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                        <Image
                            src={doctor.image}
                            width={32}
                            height={32}
                            alt={doctor.name}
                            className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                    </div>
                </SelectItem>
            ))}
          </CustomFormField>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "insuranceProvider"
              label = "Insurance provider"
              placeholder = "ex. TATA AIG Health Insurance"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "insurancePolicyNumber"
              label = "Insurance policy number"
              placeholder = "ex: ABC1234567"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "allergies"
              label = "Allergies(if any)"
              placeholder = "ex. Peanuts, Penicillin, Pollen"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "currentMedications"
              label = "Current medications"
              placeholder = "ex. Ibuprofen 200mg, Levothryoxine 50mcg"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name = "familyMedicalHistory"
              label = "Family medical history(if relevant)"
              placeholder = "ex. Sister had breast cancer"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name = "pastMedicalHistory"
              label = "Past medical history"
              placeholder = "ex: Asthma diagnosis in childhood"
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification and Verification</h2>

            </div>            
          </section>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name = "identificationType"
            label="Identification Type"
            placeholder = "Select a Document"
          >
            {IdentificationTypes.map((type)=>(
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name = "identificationNumber"
              label = "Identification Number"
              placeholder = "ex. 1234567"
            />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name = "IdentificationDocument"
            label = "Scanned copy of identification document"
            renderSkeleton={(field)=>(
                <FormControl>
                    <FileUploader 
                        files={field.value}
                        onChange={field.onChange}
                    />
                </FormControl>
            )}/>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>
            </div>            
          </section>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name = "treatmentConsent"
            label = "I consent to receive treatment for my health condition."
            />
          
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name = "disclosureConsent"
            label = "I consent to the use and disclosure of my health information for treatment purposes."
            />
        
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name = "privacyConsent"
            label = "I acknowledge that I have reviewed and agree to the privacy policy"
            />

          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
