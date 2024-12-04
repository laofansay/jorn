import React, { useState, useEffect, useRef } from "react";
import { Logs } from "lucide-react";

import { ICheckJobDay } from "@/app/shared/model/check-job-day.model";
import { DataTable } from "@/components/ui/data-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@nextui-org/react";
import { getEntities } from "@/app/shared/reducers/entities/check-job-log.reducer";

interface ViewLogsProps {
  jobId: string;
}

interface User {
  name: string;
  title: string;
  email: string;
  role: string;
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
      )
        return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

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
  const loading = useAppSelector((state) => state.checkJobLog.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        quyer: `checkJobDay.id=${jobId}`,
        sort: "id,desc",
      }),
    );
  };

  useEffect(() => {
    getAllEntities();
  }, []);

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
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center px-4 py-5 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        {/* body */}
        <div className="overflow-hidden rounded-[10px]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1170px]">
              {/* table header start */}
              <div className="grid grid-cols-12 bg-[#F9FAFB] px-5 py-4 dark:bg-meta-4 lg:px-7.5 2xl:px-11">
                <div className="col-span-3">
                  <h5 className="font-medium text-[#637381] dark:text-bodydark">
                    NAME
                  </h5>
                </div>

                <div className="col-span-3">
                  <h5 className="font-medium text-[#637381] dark:text-bodydark">
                    TITLE
                  </h5>
                </div>

                <div className="col-span-3">
                  <h5 className="font-medium text-[#637381] dark:text-bodydark">
                    EMAIL
                  </h5>
                </div>

                <div className="col-span-3">
                  <h5 className="font-medium text-[#637381] dark:text-bodydark">
                    EMAIL
                  </h5>
                </div>
              </div>
              {/* table header end */}

              {/* table body start */}
              <div className="bg-white dark:bg-boxdark">
                {checkJobLogs.map((log, checkJobLogs) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11"
                  >
                    <div className="col-span-3">
                      <p className="text-[#637381] dark:text-bodydark">
                        {log.fileName}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <p className="text-[#637381] dark:text-bodydark">
                        {log.fileType}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <p className="text-[#637381] dark:text-bodydark">
                        {log.sourceUrl}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-[#637381] dark:text-bodydark">
                        {log.targetUrl}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[#637381] dark:text-bodydark">
                        {log.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* table body end */}
            </div>
          </div>
        </div>

        {/* end body */}
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          onBlur={() => setModalOpen(false)}
          className="bg-primarytext-center bg- relative w-full max-w-142.5 rounded-lg bg-slate-800 px-8 py-12 md:px-17.5 md:py-15"
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-primary"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                className="fill-current stroke-current"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;
