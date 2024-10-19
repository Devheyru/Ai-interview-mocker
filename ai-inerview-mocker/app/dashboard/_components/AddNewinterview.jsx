"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
function AddNewinterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperiencs, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jesonResponse, setJesonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobDesc, jobExperiencs, jobPosition);
    const InputPrompt =
      "job position: " +
      jobPosition +
      ", jobdescription:" +
      jobDesc +
      ", years of experience:" +
      jobExperiencs +
      ". depending on the given information, give me" +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " breif interview questions along with answers in JSON format. give me questions and answers field on JSON";
    const result = await chatSession.sendMessage(InputPrompt);

    const MockJesonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(MockJesonResp));
    setJesonResponse(MockJesonResp);

    if (MockJesonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jesonMockResp: MockJesonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperiencs,
          createdBy: user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });
      console.log("insertedId: ", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("Error");
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary 
                  hover:scale-105 hover:shadow-md
                  cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className=" text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job you are interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job descreption
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>job role/position</label>
                    <Input
                      placeholder="ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className=" my-3">
                    <label>job descreption/tech stack(in short)</label>
                    <Textarea
                      placeholder="ex. React, Angular, NodeJs, Mysql ...etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>years of experience (year)</label>
                    <Input
                      placeholder="ex. 4"
                      type="number"
                      required
                      max="50"
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> "Generating
                        from Ai"
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewinterview;
