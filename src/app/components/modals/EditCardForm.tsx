'use client';
import { useCallback, useEffect, useState } from 'react';
import AssigneeInput from '../Inputs/AssigneeInput';
import TitleInput from '../Inputs/TitleInput';
import DescriptionInput from '../Inputs/DescriptionInput';
import DueDateInput from '../Inputs/DueDateInput';
import TagInput from '../Inputs/TagsInput';
import ImageInput from '../Inputs/ImageInput';
import { Assignee, Datas, Members, State } from '../Inputs/InputTypes';
import axios from '@/app/api/axios';
import { Button } from '../ui/button';
import StateInput from '../Inputs/StateInput';
import { useDashboardId } from '@/context/DashBoardIdContext';

interface ModalProps {
  columnId: number;
  loginToken: string;
  cardId: number | string;
  closeModal: () => void;
  setIsCardChange: any;
}

const BUTTON_STYLE =
  'flex h-[48px] w-[120px] items-center justify-center font-medium max-sm:h-[42px] max-sm:flex-grow max-sm:text-[14px]';
const MODAL_TITLE_STYLE =
  'w-full text-[24px] font-bold text-custom_black-_333236';

const EditCardForm = ({
  columnId,
  loginToken,
  cardId,
  closeModal,
  setIsCardChange,
}: ModalProps) => {
  const [datas, setDatas] = useState<Datas>({
    assignee: {
      userId: 0,
      nickname: '',
    },
    title: '',
    description: '',
    dueDate: '',
    tags: [],
    imageUrl: '',
    columnId: 0,
  });
  const [isAssigneeFocused, setIsAssigneeFocused] = useState<boolean>(false);
  const [isStateFocused, setIsStateFocused] = useState<boolean>(false);
  const [members, setMembers] = useState<Members>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [initDatas, setInitDatas] = useState<Datas>({
    assignee: {
      userId: 0,
      nickname: '',
    },
    title: '',
    description: '',
    dueDate: '',
    tags: [],
    imageUrl: '',
    columnId: 0,
  });
  const [states, setStates] = useState<State[]>([]);
  const { dashboardID } = useDashboardId();

  const getMembers = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/members?size=409&dashboardId=${dashboardID}`,
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );
      const { members } = data;
      setMembers(members);
    } catch (err) {
      console.log(err);
    }
  }, [dashboardID, loginToken]);

  const getCardDatas = useCallback(async () => {
    try {
      const { data } = await axios.get(`/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      const {
        title,
        description,
        dueDate,
        tags,
        imageUrl,
        assignee,
        columnId,
      } = data;
      const cardData = {
        title,
        description,
        dueDate,
        tags,
        imageUrl,
        assignee,
        columnId,
      };
      setDatas(cardData);
      setInitDatas(cardData);
    } catch (err) {
      console.log(err);
    }
  }, [cardId, loginToken]);

  //대시보드 컬럼 불러오기
  const getStates = useCallback(async () => {
    try {
      const { data } = await axios.get(`/columns?dashboardId=${dashboardID}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      const { data: states } = data;
      setStates(states);
    } catch (err) {
      console.log(err);
    }
  }, [dashboardID, loginToken]);

  const editCard = async () => {
    console.log('put이 출발했어요');
    const postBody = {
      assigneeUserId: datas.assignee.userId,
      columnId: datas.columnId,
      title: datas.title,
      description: datas.description,
      dueDate: datas.dueDate,
      tags: datas.tags,
      imageUrl: datas.imageUrl,
    };
    try {
      const res = await axios.put(`/cards/${cardId}`, postBody, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
    } catch (err) {
      console.log(err);
      alert('미안하지만 카드 수정은 실패다');
    } finally {
      setIsCardChange(true);

      //수정한 컬럼 바로 랜더링 할 수 있도록 수정하겠습니다.
      window.location.reload();
    }
  };

  const onUpdate = useCallback(
    <T extends keyof Datas>(key: T, value: Datas[T]) => {
      setDatas((prev) => {
        return { ...prev, [key]: value };
      });
    },
    [],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getMembers();
      getCardDatas();
      getStates();
    }
  }, [isMounted, getMembers, getCardDatas, getStates]);

  if (!isMounted) return;
  return (
    <div
      className='max-sm:mb=[-8px] custom-scrollbar mb-[-4px] mr-[-4px] flex max-h-[calc(100vh-100px)] w-[calc(100vw-96px)] max-w-[458px] flex-col gap-y-[16px] overflow-y-scroll bg-white pr-[4px] max-sm:mr-[-8px] max-sm:mt-[8px]'
      onClick={() => {
        setIsAssigneeFocused(false);
        setIsStateFocused(false);
      }}
    >
      <h2 className={MODAL_TITLE_STYLE}>할 일 수정</h2>
      <div
        className='flex gap-[16px] max-sm:flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div onClick={() => setIsAssigneeFocused(false)}>
          <StateInput
            states={states}
            columnId={columnId}
            onUpdate={onUpdate}
            controlFocus={{
              isFocused: isStateFocused,
              setIsFocused: setIsStateFocused,
            }}
          />
        </div>
        <div onClick={() => setIsStateFocused(false)}>
          <AssigneeInput
            assignee={datas.assignee}
            members={members}
            onUpdate={onUpdate}
            controlFocus={{
              isFocused: isAssigneeFocused,
              setIsFocused: setIsAssigneeFocused,
            }}
          />
        </div>
      </div>
      <TitleInput onUpdate={onUpdate} initTitle={initDatas.title} />
      <DescriptionInput
        onUpdate={onUpdate}
        initDescription={initDatas.description}
      />
      <DueDateInput onUpdate={onUpdate} initDueDate={initDatas.dueDate} />
      <TagInput onUpdate={onUpdate} initTags={initDatas.tags} />
      <ImageInput
        onUpdate={onUpdate}
        columnId={columnId}
        initImageUrl={initDatas.imageUrl}
        loginToken={loginToken}
      />
      <div className='flex flex-row-reverse gap-x-[12px]'>
        <button
          onClick={editCard}
          type='button'
          disabled={
            datas.assignee.nickname === '' ||
            datas.title === '' ||
            datas.description === '' ||
            datas.dueDate === '' ||
            datas.tags.length === 0 ||
            datas.imageUrl === '' ||
            ((datas.assignee.userId === initDatas.assignee.id ||
              datas.assignee.userId === undefined) &&
              datas.columnId === initDatas.columnId &&
              datas.description === initDatas.description &&
              datas.imageUrl === initDatas.imageUrl &&
              datas.dueDate === initDatas.dueDate &&
              datas.tags.length === initDatas.tags.length &&
              datas.tags.every((v, i) => v === initDatas.tags[i]) &&
              datas.title === initDatas.title)
          }
          className={`${BUTTON_STYLE} bg-custom_violet-_5534da text-custom_white hover:bg-[#4423c8] disabled:bg-custom_gray-_9fa6b2`}
        >
          수정
        </button>
        <Button
          onClick={closeModal}
          type='button'
          className={`${BUTTON_STYLE} border border-solid border-custom_gray-_d9d9d9 bg-custom_white text-custom_gray-_787486 hover:text-custom_white`}
        >
          취소
        </Button>
      </div>
    </div>
  );
};

export default EditCardForm;
