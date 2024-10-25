"use client";
import { ICheckJob } from "@/app/shared/model/check-job.model";
import {
  createEntity,
  updateEntity,
} from "@/app/shared/reducers/entities/check-job.reducer";
import { Button } from "@/components/ui/button";

import { listRootFolders } from "@/app/shared/reducers/entities/google-drive.reducer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heading } from "@/components/native/heading";
import { get } from "http";

const formSchema = z.object({
  jobName: z.string().min(1, "请输入一个任务名称"),
  tag: z.string().min(1, "请设置一个别名(如TX支票，本州支票)"),
  //rootFolderName: z.string().min(1, "请选择一个Googler Drver的目录"),
  rootFolderId: z.string().min(1, "请选择一个Googler Drver的目录"),
});

interface CheckJobFormProps {
  checkJob: ICheckJob;
  isEditing: boolean;
}
export const CheckJobForm: React.FC<CheckJobFormProps> = ({
  checkJob,
  isEditing,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const dispatch = useAppDispatch();
  const checkJobEntity = useAppSelector((state) => state.checkJob.entity);
  const updating = useAppSelector((state) => state.checkJob.updating);
  const updateSuccess = useAppSelector((state) => state.checkJob.updateSuccess);

  const googleFiles = useAppSelector((state) => state.googleFile.entities);
  const loading = useAppSelector((state) => state.googleFile.loading);

  const title = isEditing ? "修改任务" : "添加任务";
  const description = isEditing ? "修改任务" : "添加任务";
  const toastMessage = isEditing ? "修改成功." : "添加成功";
  const action = isEditing ? "修改" : "新增";

  const form = useForm<ICheckJob>({
    resolver: zodResolver(formSchema),
    defaultValues: checkJob || {
      jobName: "",
      tag: "",
      rootFolderName: "",
      rootFolder: false,
    },
  });

  const onSubmit = (values: ICheckJob) => {
    if (values.id !== undefined && typeof values.id !== "number") {
      values.id = Number(values.id);
    }
    const entity = {
      ...checkJobEntity,
      ...values,
      rootFolderName: "testsad",
    };
    if (isEditing) {
      dispatch(updateEntity(entity));
    } else {
      dispatch(createEntity(entity));
    }
  };
  useEffect(() => {
    if (updateSuccess) {
      router.push(`/job/checkJob`);
      toast.success(toastMessage);
    }
    dispatch(listRootFolders());
  }, [updateSuccess, dispatch]);

  const onDelete = async () => {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {isEditing && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-1">
            <FormField
              control={form.control}
              name="jobName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>任务名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="please input a tag"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>任务别名</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="please input content person"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rootFolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Googler Drver的目录</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {googleFiles.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id as string}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rootFolderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Googler Drver的目录Id</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="please input  Province & city"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button disabled={updating} className="ml-auto" type="submit">
                {action}
              </Button>
              <Button className="ml-auto" onClick={() => window.history.back()}>
                返回
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
