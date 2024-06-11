'use client';

import React, { useEffect, useState } from 'react';
import { INPUT_STYLE, LABLE_INPUT_STYLE, LABLE_STYLE } from './BaseInput';
import { SetData } from './InputTypes';

interface Props {
  setData: SetData;
  initDueDate: string;
}
export default function DueDateInput({ setData, initDueDate }: Props) {
  const [inputValue, setInputValue] = useState<string>(initDueDate);

  function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (1 + date.getMonth())).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const min = ('0' + date.getMinutes()).slice(-2);

    return year + '-' + month + '-' + day + 'T' + hour + ':' + min;
  }

  const removeT = (time: string) => {
    return time.replace('T', ' ');
  };

  useEffect(() => {
    setData({ DueDate: inputValue });
  }, [inputValue, setData]);
  return (
    <div className={`${LABLE_INPUT_STYLE} text-black`}>
      <label htmlFor='dueDate' className={LABLE_STYLE}>
        마감일
      </label>
      <input
        id='dueDate'
        data-placeholder='날짜를 입력해주세요'
        type='datetime-local'
        min={getToday()}
        onChange={(e) => {
          setInputValue(removeT(e.target.value) || '');
        }}
        required
        value={inputValue}
        className={`${INPUT_STYLE} customDate delDate relative flex h-[56px] w-[100%] whitespace-nowrap bg-[url('/images/calender-icon.svg')] bg-[center_left_16px] bg-no-repeat pl-[44px] before:text-custom_gray-_9fa6b2 before:content-[attr(data-placeholder)] valid:before:hidden max-sm:h-[53px] max-sm:pl-[42px]`}
      />
    </div>
  );
}
