"use client";

import { useAppDispatch, useAppSelector } from "@/store";

import React, { useState, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import { getEntities } from "@/app/shared/reducers/entities/check-job.reducer";
import {
  defaultValue,
  ICheckJobDay,
} from "@/app/shared/model/check-job-day.model";
import { createEntity } from "@/app/shared/reducers/entities/check-job-day.reducer";

// 将 flatpickr 配置提取到组件外部
const flatpickrConfig = {
  mode: "single",
  static: true,
  monthSelectorType: "static",
  dateFormat: "m-d-Y",
  prevArrow:
    '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  nextArrow:
    '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
};

const Addjob: React.FC = () => {
  const fpRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  const dispatch = useAppDispatch();

  const [entity, setEntity] = useState<ICheckJobDay>(defaultValue);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

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

  // list checkjob

  const checkJobs = useAppSelector((state) => state.checkJob.entities);
  const updateSuccess = useAppSelector(
    (state) => state.checkJobDay.updateSuccess,
  );
  const errorMessage = useAppSelector(
    (state) => state.checkJobDay.errorMessage,
  );

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `id,desc`,
      }),
    );
  };

  useEffect(() => {
    getAllEntities();
  }, []);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const v = {
      ...entity,
      checkJob:
        checkJobs.find((job) => job.id === Number(selectedOption)) || null,
    };

    dispatch(createEntity(v));
  };

  useEffect(() => {
    if (updateSuccess) {
      setModalOpen(false);
    }
  }, [updateSuccess, errorMessage]);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  useEffect(() => {
    // Init flatpickr
    try {
      const fpInstance = flatpickr(".form-datepicker", {
        ...flatpickrConfig,
        onChange: (selectedDates, dateStr) => {
          console.info("aa", dateStr);
          setEntity((prevData) => ({
            ...prevData,
            day: dateStr,
          }));
        },
      });

      // 存储 flatpickr 实例以便后续使用
      fpRef.current = fpInstance;

      // 清理函数
      return () => {
        if (fpRef.current) {
          fpRef.current.destroy();
        }
      };
    } catch (error) {
      console.error("Error initializing flatpickr:", error);
    }
  }, [setEntity]); // 将 setEntity 添加到依赖数组

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="rounded-md bg-primary px-9 py-3 font-medium text-white"
      >
        添加任务
      </button>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <form
          onSubmit={onSubmit}
          className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            每日支票任务
          </h2>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-left text-sm font-medium text-black dark:text-white">
                  请选择一个日期
                </label>
                <div className="relative">
                  <input
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="MM-dd-yyyy"
                    data-class="flatpickr-right"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-left text-sm font-medium text-black dark:text-white">
                  请选择一个任务
                </label>

                <div className="relative z-20 bg-white dark:bg-form-input">
                  <select
                    value={selectedOption}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      changeTextColor();
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                      isOptionSelected ? "text-black dark:text-white" : ""
                    }`}
                  >
                    {checkJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.jobName}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="w-full px-3 2xsm:w-1/2">
              <button
                onClick={() => setModalOpen(false)}
                type="button"
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancel
              </button>
            </div>
            <div className="w-full px-3 2xsm:w-1/2">
              <button
                className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                type="submit"
                //onClick={() => onSubmit()}
              >
                submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addjob;
