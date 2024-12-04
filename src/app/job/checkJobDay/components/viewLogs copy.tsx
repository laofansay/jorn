import React, { useState, useEffect, useRef } from "react";
import { Logs } from "lucide-react";

import { ICheckJobLog } from "@/app/shared/model/check-job-log.model";
import { DataTable } from "@/components/ui/data-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@nextui-org/react";
import { getEntities } from "@/app/shared/reducers/entities/check-job-log.reducer";

interface ViewLogsProps {
  jobId: string;
}

const ViewLogs: React.FC<ViewLogsProps> = ({ jobId }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !modalOpen ||
        modal.current.contains(target) ||
        trigger.current.contains(target)
      ) {
        return;
      }

      getAllEntities();
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [modalOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const dispatch = useAppDispatch();
  const checkJobLogs = useAppSelector((state) => state.checkJobLog.entities);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        quyer: `checkJobDay.id=${jobId}`,
        sort: "id,desc",
      }),
    );
  };

  useEffect(() => {}, []);

  const columns: ColumnDef<ICheckJobLog>[] = [
    {
      accessorKey: "id",
      header: "id",
    },
    {
      accessorKey: "fileType",
      header: "文件类型",
    },

    {
      accessorKey: "sourceFileId",
      header: "源文件",
    },
    {
      accessorKey: "targetUrl",
      header: "目标不",
    },
    {
      accessorKey: "status",
      header: "状态",
    },
    {
      accessorKey: "完成时间",
      header: "createdDate",
    },
  ];

  return (
    <div>
      <Tooltip
        content="查看解析日志"
        placement="top"
        className="rounded-lg bg-gray-300 p-2  text-sm  text-black shadow-lg transition-opacity duration-300"
      >
        <button
          ref={trigger}
          onClick={() => setModalOpen(!modalOpen)}
          variant="outline"
        >
          <Logs className="h-4" />
        </button>
      </Tooltip>
       <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="rounded-md bg-primary px-9 py-3 font-medium text-white"
      >
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          onBlur={() => setModalOpen(false)}
          className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
        >
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Your Message Sent Successfully
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
          <p className="mb-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since
          </p>
          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="w-full px-3 2xsm:w-1/2">
              <button
                onClick={() => setModalOpen(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancel
              </button>
            </div>
            <div className="w-full px-3 2xsm:w-1/2">
              <button className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;
