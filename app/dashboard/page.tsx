'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import  CreateProjectModal  from "@/components/create-project-modal";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Download, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Empty } from "@/components/empty";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardFooter } from "@/components/ui/card";
import useProModal from "@/hooks/use-pro-modal";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {  formSchema } from "./constants";
import { getUserProjects } from "@/lib/user-project";

 function LandingPage() {
  const [hidden, setHidden] = useState(true);
  const [name, setName] = useState("");
  const proModal = useProModal();
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  console.log('TESTISIII')
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      values
      console.log('TESTI', values.name)
      setName("")
      const response = await axios.post("/api/createproject", values);

      const name = response.data.name;
      setName(name);

      form.reset();
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };
  let getUserProjects = async () => {
    const response = await axios.get("/api/getprojects");
    console.log(response, 'responseeeeeeeeeeeeeeeeeeeeeeee')
    setProjects(response.data);
    return response.data;
  }

  useEffect(() => {
    getUserProjects();
  }, []);
    




  return (
    <div className="h-full">
      <p>Very good projects</p>
      <div className="m-auto h-full hidden justify-center items-center">
        <Button onClick={() => setHidden(false)}>Add new project</Button>
      </div>
      <div className="mt-11 grid grid-cols-6 gap-6">
    
     {projects.map((project: any, index: number) => (
        <Link key={index} href="/project1" className="bg-red-100">{project.id} </Link>
      ))}

      <Button onClick={() => setHidden(false)} className="flex">Add new project</Button>

      </div>
      <CreateProjectModal hidden={hidden} setHidden={setHidden} name="DA" onSubmit={onSubmit} form={form} isLoading={isLoading}/>

    </div>
  );
}

export default LandingPage;
 