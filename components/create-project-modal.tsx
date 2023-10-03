'use client'

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmptyProps {
	hidden: Boolean;
    name: string
    setHidden: any,
    onSubmit: any,
    isLoading: any,
    form: any
}
 const CreateProjectModal = ({ hidden, name, setHidden, onSubmit, isLoading, form }: EmptyProps) => {
 
	return (
    <div tabIndex={-1} aria-hidden="true" className={`fixed flex justify-center items-center top-0 left-0 right-0 z-50 w-full ${hidden ? 'hidden' : ''} p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
        <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <Button type="button" onClick={() => {setHidden(true)}} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </Button>
                <div className="px-6 py-6 lg:px-8">
                    <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">What the name of the album would be? </h3>
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-1 gap-2" >                        
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <FormField
                                name="name"
                                render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-6">
                                    <FormControl className="m-0 p-0">
                                    <Input
                                        id="projectnameinput"
                                        aria-describedby="projectnameinput"
                                        {...field}
                                        placeholder="Start typing here..."
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                        disabled={isLoading}
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />                        
                            </div>
                
                            <Button type="submit" className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>                  
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    </div> 
	);
};

export default CreateProjectModal;