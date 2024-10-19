"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  /**    used to Get intrerview deteils
   by MockId / interviewId*/

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]);
  };
  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-flow-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5 ">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job role/position: </strong> {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech stack: </strong>{" "}
              {interviewData?.jobDesc}{" "}
            </h2>
            <h2 className="text-lg">
              <strong>Years of experience: </strong>{" "}
              {interviewData?.jobExperience}{" "}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-400 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-green-500">
              {" "}
              <Lightbulb /> <strong>Information</strong>{" "}
            </h2>

            <h2 className="mt-3 text-yellow-700">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>

        <div>
          {webcamEnabled ? (
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 my-7 w-full p-20 bg-secondary rounded-lg border" />

              <Button
                variant="ghost"
                className="w-full bg-gray-50"
                onClick={() => setWebcamEnabled(true)}
              >
                Enable Camera and microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Button>Start Interviwe</Button>
      </div>
    </div>
  );
}

export default Interview;
