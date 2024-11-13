import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";

export default async function NewAppointment({params: { userId }}: SearchParamProps) {
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      {/*TODO: OTP Verification | PasskeyModal*/}

      <section className="remove-scrollbar container my-auto">        
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/Logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-ft"
          ></Image>

          <AppointmentForm
            patientId={patient?.$id}
            type="create"
            userId={userId}
          />

          <p className="copyright py-12">
            © 2024 Patient+
          </p>
          
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
