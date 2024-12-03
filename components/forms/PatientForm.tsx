"use client"

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {Form} from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType{
  INPUT = 'input',
  TEXTAREA = "textarea",
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}


const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name:"",
      email:"",
      phone:""
    },
  });


  const onSubmit= async(values: z.infer<typeof UserFormValidation>)=> {
    setisLoading(true);

    try{
      const userData = {
        name: values.name, 
        email: values.email, 
        phone: values.phone,
      };

      const newUser = await createUser(userData);

      if(newUser){
        console.log("Redirecting to:", `/patients/${newUser.$id}/register`);
        router.push(`/patients/${newUser.$id}/register`);
      }
      else {
        console.log("User creation failed or user ID not returned.");
      }
    } catch(error){
      console.log(error);
    }

    setisLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          <section className="mb-12 space-y-4">
            <h1 className="header">Hi there👋</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
          </section>
          
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name = "name"
            label = "Full name"
            placeholder = "Mridul Birla"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

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

          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;
