import Column from '@/app/components/Column';
import { Button } from '@/app/components/ui/button';
import ChipAddIcon from '@/app/components/ui/chipAddIcon';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

const columnMockData = {
  result: 'SUCCESS',
  data: [
    {
      id: 0,
      title: 'TO DO',
      teamId: 'string',
      createdAt: '2024-05-31T16:47:59.846Z',
      updatedAt: '2024-05-31T16:47:59.846Z',
    },
    {
      id: 1,
      title: 'On Progress',
      teamId: 'string',
      createdAt: '2024-05-31T16:47:59.846Z',
      updatedAt: '2024-05-31T16:47:59.846Z',
    },
  ],
};

const modalButtonStyle = 'text-center w-[120px] h-[48px] text-[16px]';

export default function dashboardPage() {
  return (
    <div className='flex flex-wrap bg-custom_gray-_fafafa'>
      {columnMockData.data.map((column: any, index: number) => {
        return <Column key={column.id} title={column.title} />;
      })}
      {/* 카드 추가하기 모달 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='w-[354px] h-[70px] bg-white rounded-md border border-gray-_d9d9d9 flex justify-center items-center relative top-[68px] left-[20px]'
          >
            <span className='mr-[12px] text-[16px] font-bold'>
              새로운 컬럼 추가하기
            </span>
            <ChipAddIcon size={'large'} />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>새 컬럼 생성</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='flex flex-col gap-4'>
              <Label htmlFor='name'>이름</Label>
              <Input
                id='name'
                placeholder='새로운 프로젝트'
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type='button'
                variant='secondary'
                className={`${modalButtonStyle} text-[#787486] bg-white border border-[#d9d9d9]`}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type='submit'
              className={`${modalButtonStyle} bg-[#5534DA]`}
            >
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
