'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { listingFormSchema } from "@/lib/validator"
import * as z from "zod"
import { houseDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"
import {FileUploader} from "./FileUploader"
import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import {useUploadThing} from '@/lib/uploadthing'
import { useRouter } from "next/navigation"
import { createListing, updateListing } from "@/lib/actions/house.actions"
import { IHouses } from "@/lib/database/models/houses.model"

type ListingFormProps ={
    userId:string
    type:'Create'| 'Update'
    house?: IHouses
    houseId?: string
}

const ListingForm = ({userId, type, house, houseId}:ListingFormProps) => {
    const[files, setFiles] = useState<File[]>([])
    const initialValues = house && type === 'Update' ? house: houseDefaultValues
    const {startUpload} = useUploadThing('imageUploader')
    const router = useRouter()
    const form = useForm<z.infer<typeof listingFormSchema>>({resolver: zodResolver(listingFormSchema), defaultValues: initialValues })

    async function onSubmit(values: z.infer<typeof listingFormSchema>) {
        let uploadedImageUrl = values.imageUrl;

        if(files.length > 0) {
          const uploadedImages = await startUpload(files)
          if(!uploadedImages) {
            return
          }
          uploadedImageUrl = uploadedImages[0].url
        }
    
        if(type === 'Create') {
          try {
            const newListing = await createListing({house: { ...values, imageUrl: uploadedImageUrl },userId,path: '/profile' })
            if(newListing) {
              form.reset();
              router.push(`/houses/${newListing._id}`)
            }
          } catch (error) {
            console.log(error);
          }
        }
    
        if(type === 'Update') {
          if(!houseId) {
            router.back()
            return;
          }
          try {
            const updatedListing = await updateListing({
              userId,house: { ...values, imageUrl: uploadedImageUrl, _id: houseId },path: `/houses/${houseId}`})
    
            if(updatedListing) {
              form.reset();
              router.push(`/houses/${updatedListing._id}`)
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
 
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl>
                    <Input placeholder="Listing title" {...field} className="input-field"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

             <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl>
                    <Dropdown onChangeHandler={field.onChange} value={field.value} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="flex-flex-col gap-5 md:flex-row">
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem className="w-full mb-5">
                    <FormControl className="h-72">
                    <Textarea placeholder="Description" {...field} className="textarea rounded-2xl"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl className="h-72">
                    <FileUploader onFieldChange={field.onChange} imageUrl={field.value} setFiles={setFiles} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
        <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl className="h-72">
                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                          <Image src='/assets/icons/location-grey.svg' alt='location' width={24} height={24} />  
                          <Input placeholder="Location" {...field} className="input-field"/>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
        <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl className="h-72">
                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                          <Image src='/assets/icons/dollar.svg' alt='dollar' width={24} height={24} />  
                          <Input placeholder="Price" {...field} className="input-field p-regular-16" type="number"/>
                    <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                        <FormItem >
                            <FormControl >
                                <div className="flex items-center">
                                  <label htmlFor="isAvailable" className="whitespace-nowrap leading-none pr-3 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Available</label>  
                                  <Checkbox id='isFree' onCheckedChange={field.onChange} checked={field.value} className="mr-2 h-5 w-5 border-2 border-primary-500" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
      <Button type="submit" size='lg' disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
        {form.formState.isSubmitting ?(
            'Submitting...'
        ):(
            `${type} Listing`
        )}</Button>
    </form>
  </Form>
  )
}

export default ListingForm