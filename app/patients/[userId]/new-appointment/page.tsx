import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function newAppointment() {
  return (
    <div className="flex h-screen max-h-screen">
      {/*TODO: OTP Verification | PasskeyModal*/}

      <section className="remove-scrollbar container my-auto">        
        <div className="sub-container max-w-[86px] flex-1 justify-between">
          <Image
            src="/assets/Logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-ft"
          ></Image>

          {/* <PatientForm/> */}

          <p className="copyright py-12">
            © 2024 Patient+
          </p>
          
        </div>
      </section>
      <Image
        src="/assets/Illustration.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
