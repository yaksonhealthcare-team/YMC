# MUI → Tailwind + shadcn 마이그레이션 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `@mui/material`, `@mui/x-date-pickers`, `@emotion/react`, `@emotion/styled` 의존성을 완전 제거하고, Tailwind CSS + shadcn/ui 단일 스타일링 시스템으로 통합한다.

**Architecture:**
- 레이아웃 프리미티브 (`Box`, `Container`, `Stack`, `Typography`) → 그냥 HTML + Tailwind
- 베이스 UI 컴포넌트 (`Button`, `Input`, `Switch`, `Tabs` 등) → shadcn/ui 기반으로 교체
- 오버레이 (`Dialog` 모달 → shadcn `Dialog`, 바텀시트 → shadcn `Drawer`)
- 캘린더 (`DateCalendar`) → shadcn `Calendar` (내부가 react-day-picker)
- 래퍼 컴포넌트 내부만 교체, 외부 API는 최대한 유지
- 중간 임시 구현 없이 MUI 제거와 shadcn 도입 동시 진행

**Tech Stack:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, vaul (Drawer), dayjs, clsx, tailwind-merge

**검수 명령어:** `yarn typecheck` (= `tsc -p tsconfig.app.json --noEmit`)

**원칙:**
- 로직 변경 없음. 스타일링 레이어만 교체.
- 각 STEP 완료 후 `yarn typecheck` 실행하여 0 에러 확인 후 커밋.
- shadcn 컴포넌트는 소스가 프로젝트에 복사되므로 자유롭게 커스터마이징 가능.

---

## STEP 0: shadcn 초기 설정

> 모든 교체 작업 전에 선행. shadcn CLI로 프로젝트 초기화 및 필요 패키지 설치.

### 0-1. tailwind-merge 설치

shadcn의 `cn()` 유틸리티가 필요로 함.

```bash
yarn add tailwind-merge
```

### 0-2. cn 유틸리티 생성

**Create:** `src/shared/lib/utils/cn.ts`

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 0-3. shadcn 초기화

```bash
npx shadcn@latest init
```

CLI 질문 답변:
- Style: **Default**
- Base color: **Slate** (이후 CSS variables에서 프로젝트 색상으로 덮어씀)
- CSS variables: **Yes**
- Config file: `tailwind.config.js`
- Global CSS: `src/app/styles/index.css`
- Components alias: `@/shared/ui`
- Utils alias: `@/shared/lib/utils`

생성되는 `components.json` 확인 후 필요시 수동 수정:

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/styles/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/lib/hooks"
  }
}
```

### 0-4. CSS variables 색상 설정

shadcn init이 생성한 CSS variables를 프로젝트 디자인 시스템에 맞게 덮어씀.

`src/app/styles/index.css`에 아래 추가/수정:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 4 86% 67%;          /* #F37165 */
    --primary-foreground: 0 0% 100%;
    --secondary: 4 86% 96%;        /* #FEF2F1 */
    --secondary-foreground: 4 86% 50%;
    --destructive: 4 100% 61%;     /* #FF453A */
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 93%;            /* #ECECEC */
    --input: 0 0% 93%;
    --ring: 4 86% 67%;
    --radius: 0.5rem;
    --muted: 0 0% 97%;
    --muted-foreground: 0 0% 45%;
  }
}
```

> **주의:** 기존 `tailwind.config.js`의 커스텀 색상(`primary`, `gray`, `error`, `success` 등)은 그대로 유지. shadcn CSS variables는 shadcn 컴포넌트 전용.

### 0-5. tailwind.config.js에 CSS variables 연결

shadcn init이 자동으로 추가하지만, 기존 커스텀 설정과 충돌 없는지 확인:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      // 기존 커스텀 색상 유지 (primary, gray, error 등)
      // shadcn CSS variables 추가
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
  },
},
```

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "chore: shadcn/ui 초기 설정 및 cn 유틸리티 추가 (STEP 0)"
```

---

## STEP 1: 레이아웃 프리미티브 제거 (Box, Container, Stack, Typography, useTheme)

> shadcn 대상 아님. 이 컴포넌트들은 그냥 HTML + Tailwind로 교체.
> `useTheme`에서 가져오는 `palette.primary.main`은 `#F37165` (Tailwind `primary` 색상).

**수정 파일:**

### 1-1. `src/widgets/layout/model/LayoutContext.tsx`

```ts
// 제거
import { Box, Typography, useTheme } from '@mui/material';
const { palette } = useTheme();
```

교체:
- `<Box flex={1}>` → `<div className="flex-1">`
- `<Box position="relative" flex={1}>` → `<div className="relative flex-1">`
- `<Box sx={{ position: 'absolute', top: 4, right: 0, backgroundColor: palette.primary.main, color: '#FFFFFF', padding: '2px 4px', borderRadius: '4px', zIndex: -1 }}>` → `<div className="absolute top-1 right-0 bg-primary text-white px-1 py-0.5 rounded z-[-1]">`
- `<Typography variant="subtitle2">OPEN</Typography>` → `<span className="text-xs font-medium">OPEN</span>`
- `<Typography variant="body2" className={...}>` → `<span className={...}>`

### 1-2~1-7. 나머지 파일들

각 파일 읽고 패턴 파악 후 교체:
- `src/widgets/brand-swiper/ui/SwiperBrandCard.tsx` — `Box` → `div`
- `src/pages/findAccount/FindAccount.tsx` — `Box` → `div`
- `src/pages/home/Notification.tsx` — `Container` → `div className="w-full max-w-sm mx-auto"`
- `src/pages/home/Home.tsx` — `Container`, `Typography` → `div`, `p`
- `src/pages/popup/PopupDetailPage.tsx` — `Box`, `Container`, `Typography` → HTML
- `src/pages/logout/Logout.tsx` — `Typography` → `p`
- `src/pages/myPage/ui/MyPagePointMembership.tsx` — `Stack`, `Typography` (Divider는 STEP 2에서)

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: Box/Container/Stack/Typography → HTML + Tailwind (STEP 1)"
```

---

## STEP 2: Separator (Divider 교체)

### 2-1. shadcn Separator 설치

```bash
npx shadcn@latest add separator
```

`src/shared/ui/separator.tsx` 생성됨.

### 2-2. 수정 파일 (6개)

각 파일에서:
```ts
// 제거
import { Divider } from '@mui/material';
// 추가
import { Separator } from '@/shared/ui/separator';

// <Divider /> → <Separator />
// <Divider orientation="vertical" /> → <Separator orientation="vertical" />
```

- `src/widgets/price-summary/ui/PriceSummary.tsx`
- `src/pages/branch/ui/LocationSettings.tsx`
- `src/pages/reservation/ReservationCancelPage.tsx`
- `src/pages/payment/ui/PaymentCompleteInfo.tsx`
- `src/pages/myPage/ui/MyPagePointMembership.tsx`
- `src/pages/reservation/ui/ReservationSummary.tsx`

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Divider → shadcn Separator (STEP 2)"
```

---

## STEP 3: CircularProgress → Loader2 + animate-spin, Skeleton 교체

### 3-1. shadcn Skeleton 설치

```bash
npx shadcn@latest add skeleton
```

### 3-2. CircularProgress 교체 (5개 파일)

shadcn은 원형 스피너 컴포넌트가 없음. lucide-react의 `Loader2` 아이콘 + `animate-spin` 사용 (lucide-react는 shadcn 설치 시 이미 포함됨).

기존 `LoadingIndicator` 컴포넌트가 이미 있다면 그것을 우선 사용.
없다면:

```tsx
// 제거
import { CircularProgress } from '@mui/material';

// 교체
import { Loader2 } from 'lucide-react';
// <CircularProgress size={20} /> → <Loader2 className="animate-spin w-5 h-5 text-primary" />
// <CircularProgress /> → <Loader2 className="animate-spin w-6 h-6 text-primary" />
```

수정 파일:
- `src/pages/login/EmailLogin.tsx`
- `src/pages/signup/ProfileSetup.tsx`
- `src/pages/signup/EmailPassword.tsx`
- `src/pages/signup/SignupComplete.tsx`
- `src/pages/signup/SignupCallback.tsx`

### 3-3. Skeleton 교체 (1개 파일)

```tsx
// 제거
import { Skeleton } from '@mui/material';
// 추가
import { Skeleton } from '@/shared/ui/skeleton';
// API 거의 동일, className으로 크기 지정
// <Skeleton variant="rectangular" width={200} height={20} />
// → <Skeleton className="w-[200px] h-5" />
```

수정 파일:
- `src/pages/reservation/ReservationDetailPage.tsx`

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: CircularProgress → Loader2, Skeleton → shadcn Skeleton (STEP 3)"
```

---

## STEP 4: SvgIcon, IconButton 제거

### 4-1. SvgIcon 사용 파일 확인

```bash
grep -r "SvgIcon" src/ --include="*.tsx" --include="*.ts" -l
```

교체 패턴:
```tsx
// 제거
import { SvgIcon } from '@mui/material';
// <SvgIcon><path d="..." /></SvgIcon>

// 교체: SVG를 ?react로 import하거나 lucide-react 아이콘 사용
import SomeIcon from '@/assets/icons/SomeIcon.svg?react';
// <SomeIcon className="w-5 h-5" />
```

### 4-2. IconButton 교체 (1개 파일)

`src/pages/addUsingBranch/Step1SearchBranchList.tsx`

```tsx
// 제거
import { IconButton } from '@mui/material';

// 교체: shadcn Button variant="ghost"
import { Button } from '@/shared/ui/button';
// <IconButton onClick={...}><SomeIcon /></IconButton>
// → <Button variant="ghost" size="icon" onClick={...}><SomeIcon className="w-5 h-5" /></Button>
```

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: SvgIcon → native SVG, IconButton → shadcn Button ghost (STEP 4)"
```

---

## STEP 5: Button 교체

### 5-1. shadcn Button 설치

```bash
npx shadcn@latest add button
```

`src/shared/ui/button.tsx` 생성됨.

### 5-2. 커스텀 variant 추가

shadcn Button은 기본적으로 `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` variant를 제공.
프로젝트는 `primary`, `line`, `gray`, `text`, `grayLine`, `secondary` variant가 필요하므로 생성된 `button.tsx`에 추가.

`src/shared/ui/button.tsx` 수정 (shadcn 생성 파일):
```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center ...',
  {
    variants: {
      variant: {
        // shadcn 기본 variants 유지
        default: '...',
        // 프로젝트 커스텀 variants 추가
        primary: 'bg-primary text-white hover:bg-primary-400 active:bg-primary-500 disabled:bg-[#DCDCDC] disabled:text-gray-400',
        secondary: 'bg-[#FEF2F1] text-primary-400 hover:bg-primary-100 active:bg-primary-200 disabled:bg-grey-50 disabled:text-gray-300',
        line: 'border border-primary bg-white text-primary-400 hover:bg-[#FEF2F1] active:bg-primary-100 disabled:text-gray-300 disabled:border-gray-300',
        gray: 'bg-gray-100 text-black hover:bg-gray-50 active:bg-gray-200 disabled:text-gray-300',
        text: 'bg-transparent text-primary hover:underline',
        grayLine: 'border border-[#ECECEC] bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        xs: 'px-3 py-[8.5px] text-12px font-sb',
        s: 'px-[9.5px] py-3 text-14px font-sb',
        m: 'px-3 py-4 text-16px font-sb',
        l: 'px-5 py-[14px] text-16px font-b',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'm',
    },
  }
);
```

### 5-3. `src/shared/ui/button/Button.tsx` 수정

기존 래퍼를 shadcn Button 기반으로 교체. 외부 API(`variantType`, `sizeType`, `iconLeft`, `iconRight`, `fullCustom`, `fullWidth`) 유지:

```tsx
import { Button as ShadcnButton, buttonVariants } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils/cn';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variantType?: 'primary' | 'secondary' | 'line' | 'gray' | 'text' | 'grayLine';
  sizeType?: 'xs' | 's' | 'm' | 'l';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullCustom?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  variantType = 'primary',
  sizeType = 'm',
  iconLeft,
  iconRight,
  children = 'Button',
  className = '',
  fullCustom = false,
  fullWidth = false,
  ...props
}: CustomButtonProps) => (
  <ShadcnButton
    variant={fullCustom ? undefined : variantType}
    size={fullCustom ? undefined : sizeType}
    className={cn(fullWidth && 'w-full', className)}
    {...props}
  >
    {iconLeft && <span className="flex mr-1.5">{iconLeft}</span>}
    {children}
    {iconRight && <span className="flex ml-1.5">{iconRight}</span>}
  </ShadcnButton>
);
```

> **주의:** Button.tsx 변경 후 `yarn typecheck`로 사용처 타입 에러 확인.

### 5-4. Filter.tsx MUI Button 교체

`src/shared/ui/filter/Filter.tsx` 파일 읽고 `import { Button } from '@mui/material'` → `import { Button } from '@/shared/ui/button/Button'`로 교체.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Button → shadcn Button 커스텀 variant (STEP 5)"
```

---

## STEP 6: Tabs 교체

### 6-1. shadcn Tabs 설치

```bash
npx shadcn@latest add tabs
```

`src/shared/ui/tabs.tsx` 생성됨 (Radix UI 기반).

### 6-2. `src/shared/ui/tabs/Tabs.tsx` 수정

shadcn Tabs는 `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` 구조.
기존 `CustomTabs`의 외부 API(`tabs`, `onChange`, `activeTab`, `type`, `className`) 유지하면서 내부를 shadcn으로:

```tsx
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils/cn';

export const CustomTabs = ({ type = 'fit', tabs, onChange, activeTab: propActiveTab, className }: CustomTabsProps) => {
  const validActiveTab = tabs.some((tab) => tab.value === propActiveTab);
  const activeTab = validActiveTab ? propActiveTab : tabs[0]?.value || '';

  return (
    <Tabs value={activeTab} onValueChange={onChange} className={className}>
      <TabsList
        className={cn(
          'bg-transparent p-0 h-auto',
          type !== '1depth' && 'border-b border-gray-200 rounded-none w-full',
          type === 'scroll' && 'overflow-x-auto no-scrollbar justify-start gap-2'
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              'rounded-none bg-transparent shadow-none',
              getTypeStyles(type, activeTab === tab.value),
              activeTab === tab.value && type !== '1depth' && 'border-b-2 border-black -mb-px data-[state=active]:bg-transparent'
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
```

### 6-3. `src/pages/membership/Membership.tsx` 교체

파일 읽고 MUI Tab/Tabs 직접 사용 → `CustomTabs` 컴포넌트로 교체.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Tabs → shadcn Tabs (STEP 6)"
```

---

## STEP 7: RadioGroup 교체

### 7-1. shadcn RadioGroup 설치

```bash
npx shadcn@latest add radio-group
```

`src/shared/ui/radio-group.tsx` 생성됨 (Radix UI 기반).

### 7-2. `src/shared/ui/radio/RadioCard.tsx` 수정

파일 읽고 `import { Radio } from '@mui/material'` 제거 → shadcn RadioGroup 기반으로 교체.

### 7-3. `src/shared/ui/radio/GenderSelect.tsx` 수정

`import { RadioGroup } from '@mui/material'` → shadcn `RadioGroup` 교체.

### 7-4. `src/pages/reservation/ui/MembershipRadioCard.tsx` 수정

파일 읽고 MUI Radio 직접 사용 → shadcn RadioGroupItem으로 교체.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Radio → shadcn RadioGroup (STEP 7)"
```

---

## STEP 8: Checkbox 교체

### 8-1. shadcn Checkbox 설치

```bash
npx shadcn@latest add checkbox
```

`src/shared/ui/checkbox.tsx` 생성됨 (Radix UI 기반).

### 8-2. 수정 파일 (2개)

```tsx
// 제거
import { Checkbox } from '@mui/material';
// 추가
import { Checkbox } from '@/shared/ui/checkbox';
// API 거의 유사: checked, onCheckedChange (MUI: onChange → shadcn: onCheckedChange)
```

- `src/entities/reservation/ui/AdditionalServiceCard.tsx`
- `src/pages/signup/TermsAgreement.tsx`

> **주의:** shadcn Checkbox의 onChange 이벤트는 `onCheckedChange: (checked: boolean) => void`. MUI는 `onChange: (event, checked) => void`. 사용처 핸들러 시그니처 수정 필요.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Checkbox → shadcn Checkbox (STEP 8)"
```

---

## STEP 9: Switch 교체

### 9-1. shadcn Switch 설치

```bash
npx shadcn@latest add switch
```

`src/shared/ui/switch.tsx` 생성됨 (Radix UI 기반).

### 9-2. `src/shared/ui/switch/Switch.tsx` 수정

```tsx
// 제거
import { Switch as MuiSwitch, SwitchProps } from '@mui/material';
import { styled } from '@mui/material/styles';
const IOSSwitch = styled(...)(...);

// 추가
import { Switch as ShadcnSwitch } from '@/shared/ui/switch';
import { cn } from '@/shared/lib/utils/cn';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const IOSSwitch = ({ checked, onCheckedChange, disabled, className }: SwitchProps) => (
  <ShadcnSwitch
    checked={checked}
    onCheckedChange={onCheckedChange}
    disabled={disabled}
    className={cn('data-[state=checked]:bg-primary', className)}
  />
);

const Switch = ({ ...props }: SwitchProps) => <IOSSwitch {...props} />;
Switch.IOS = IOSSwitch;

export default Switch;
```

> **주의:** MUI Switch의 `onChange: (event, checked) => void` → shadcn의 `onCheckedChange: (checked: boolean) => void`. 사용처 핸들러 확인 필요.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Switch → shadcn Switch (STEP 9)"
```

---

## STEP 10: Input 교체 (TextField)

### 10-1. shadcn Input, Textarea 설치

```bash
npx shadcn@latest add input textarea
```

`src/shared/ui/input.tsx`, `src/shared/ui/textarea.tsx` 생성됨.

### 10-2. `src/shared/ui/text-field/CustomTextField.tsx` 수정

shadcn Input에는 adornment(아이콘 전/후 삽입) 기능이 없으므로 커스텀 래퍼 div로 구현:

```tsx
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils/cn';

const STATE_BORDER = {
  default: 'border-[#ECECEC] focus-within:border-[#757575]',
  error:   'border-error focus-within:border-error',
  success: 'border-success focus-within:border-success',
} as const;

const CustomTextField = forwardRef<HTMLInputElement, CustomTextFieldProps>(
  ({ name, type = 'text', value, placeholder, disabled, label, helperText,
     state = 'default', iconLeft, iconRight, button, onChange, maxLength, className }, ref) => (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <div className="flex items-center">
        <div className={cn(
          'flex items-center flex-1 border rounded-xl h-[52px] px-4 transition-colors',
          STATE_BORDER[state],
          disabled && 'bg-gray-50 border-white'
        )}>
          {iconLeft && <span className="mr-2 text-gray-400 flex-shrink-0">{iconLeft}</span>}
          <Input
            ref={ref}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            maxLength={maxLength}
            className={cn(
              'flex-1 h-full border-0 shadow-none p-0 bg-transparent focus-visible:ring-0',
              disabled && 'text-[#DDDDDD]',
              className
            )}
          />
          {iconRight && <span className="ml-2 text-gray-400 flex-shrink-0">{iconRight}</span>}
        </div>
        {button && <div className="ml-1">{button}</div>}
      </div>
      {helperText && (
        <p className={cn(
          'font-m text-12px mt-1 ml-2',
          state === 'error' ? 'text-error' : state === 'success' ? 'text-success' : 'text-gray-400'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
);
```

### 10-3. `src/shared/ui/text-field/TextArea.tsx` 수정

파일 읽고 MUI TextField → shadcn Textarea 교체.

### 10-4. `src/shared/ui/text-field/SearchField.tsx` 수정

파일 읽고 MUI TextField → shadcn Input 교체.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI TextField → shadcn Input/Textarea (STEP 10)"
```

---

## STEP 11: Calendar 교체 (DateCalendar → shadcn Calendar)

> shadcn Calendar는 내부적으로 react-day-picker를 사용. 즉 react-day-picker를 직접 쓰는 것과 동일하지만 shadcn 스타일이 입혀진 버전.

### 11-1. shadcn Calendar 설치

```bash
npx shadcn@latest add calendar
```

`src/shared/ui/calendar.tsx` 생성됨 (react-day-picker 기반).

### 11-2. API 참조

> Context7 MCP로 shadcn Calendar + react-day-picker 최신 문서 확인:
> ```
> mcp__plugin_context7_context7__resolve-library-id (libraryName: "react-day-picker")
> mcp__plugin_context7_context7__query-docs (query: "single selection disabled dates onMonthChange custom components")
> ```

### 11-3. `src/shared/ui/calendar/Calendar.tsx` 재작성

현재 DateBottomSheet에서 넘기는 props (변경 없이 유지):
```tsx
<Calendar
  disablePast          // boolean
  value={selectedDate} // Dayjs | null
  onChange={...}       // (date: Dayjs) => void
  shouldDisableDate={} // (date: Dayjs) => boolean
  onMonthChange={...}  // (date: Dayjs) => void
/>
```

새 구현:
```tsx
import { Calendar as ShadcnCalendar } from '@/shared/ui/calendar';
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';

interface CalendarProps {
  value: Dayjs | null;
  onChange: (date: Dayjs) => void;
  disablePast?: boolean;
  shouldDisableDate?: (date: Dayjs) => boolean;
  onMonthChange?: (date: Dayjs) => void;
}

export const Calendar = ({ value, onChange, disablePast, shouldDisableDate, onMonthChange }: CalendarProps) => {
  const selected = value?.toDate();
  const today = new Date();

  const disabled = [
    ...(disablePast ? [{ before: today }] : []),
    ...(shouldDisableDate ? [(date: Date) => shouldDisableDate(dayjs(date))] : []),
  ];

  return (
    <ShadcnCalendar
      mode="single"
      selected={selected}
      onSelect={(date) => date && onChange(dayjs(date))}
      disabled={disabled}
      onMonthChange={(month) => onMonthChange?.(dayjs(month))}
      components={{
        Caption: ({ displayMonth }) => <CalendarHeader displayMonth={displayMonth} />,  // API 버전 확인 필요
      }}
      className="w-full"
    />
  );
};

const CalendarHeader = ({ displayMonth, onMonthChange }: { displayMonth: Date; onMonthChange?: (date: Date) => void }) => {
  const current = dayjs(displayMonth);
  const todayStartOfMonth = dayjs().startOf('month');
  const canGoPrev = current.isAfter(todayStartOfMonth, 'month');

  return (
    <div className="w-full flex items-center justify-center mb-6">
      <button
        className={clsx('mr-4', !canGoPrev && 'opacity-0 pointer-events-none')}
        onClick={() => onMonthChange?.(current.subtract(1, 'month').toDate())}
      >
        <CaretLeftIcon className="w-4 h-4" />
      </button>
      <p className="text-lg font-bold">{current.format('YYYY년 M월')}</p>
      <button className="ml-4" onClick={() => onMonthChange?.(current.add(1, 'month').toDate())}>
        <CaretRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
```

> **주의:** shadcn Calendar의 커스텀 Caption/Header props는 react-day-picker 버전에 따라 다름. 설치 후 생성된 `calendar.tsx`의 DayPicker 버전 확인 후 올바른 API 사용.

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI DateCalendar → shadcn Calendar (STEP 11)"
```

---

## STEP 12: Dialog (모달) 교체

### 12-1. shadcn Dialog 설치

```bash
npx shadcn@latest add dialog
```

`src/shared/ui/dialog.tsx` 생성됨 (Radix UI 기반).

### 12-2. `src/shared/ui/modal/ModalContext.tsx` — MODAL 케이스

```tsx
// 제거
import { Dialog, DialogContent, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
const BottomSheetTransition = ...;

// 추가
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/dialog';

// MODAL case 교체
case OverlayTypes.MODAL: {
  const modalState = overlayState as ModalState;
  const contentType = modalState.content.style ?? 'confirm';
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) modalState.content.onCancel?.({}, 'escapeKeyDown');
      }}
    >
      <DialogContent className="max-w-[400px] mx-5">
        <h2 className="text-lg font-semibold mb-2">{modalState.content.title}</h2>
        <p className="text-gray-600 mb-5">{modalState.content.message}</p>
        <div className="flex gap-2">
          {modalState.content.onCancel && contentType === 'confirm' && (
            <Button onClick={(e) => { modalState.content.onCancel?.(e); closeOverlay(); }}
              variantType="line" fullWidth className="py-3">취소</Button>
          )}
          <Button onClick={() => { modalState.content.onConfirm(); closeOverlay(); }}
            variantType="primary" fullWidth className="py-3">확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 12-3. `src/pages/branch/[id]/ui/BranchImageCarousel.tsx`

```tsx
// 제거
import { Dialog } from '@mui/material';

// 추가
import { Dialog, DialogContent } from '@/shared/ui/dialog';

// <Dialog open={true} fullScreen={true}>
// →
// <Dialog open={true}>
//   <DialogContent className="fixed inset-0 max-w-none h-full p-0 bg-black rounded-none">
```

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Dialog → shadcn Dialog (STEP 12)"
```

---

## STEP 13: Drawer (바텀시트) 교체

> shadcn `Drawer` (vaul 기반)는 드래그 닫기, 슬라이드 애니메이션이 내장.
> ModalContext의 BOTTOM_SHEET와 StartupPopup을 교체.

### 13-1. shadcn Drawer 설치

```bash
npx shadcn@latest add drawer
```

`src/shared/ui/drawer.tsx` 생성됨 (vaul 기반).

### 13-2. `src/shared/ui/modal/ModalContext.tsx` — BOTTOM_SHEET 케이스

기존 터치 드래그 로직(`handleTouchStart`, `handleTouchMove`, `handleTouchEnd`, `touchStartY`, `isDragging` 등) 제거 가능. Drawer가 내장 처리.

```tsx
import {
  Drawer,
  DrawerContent,
} from '@/shared/ui/drawer';

// BOTTOM_SHEET case 교체
case OverlayTypes.BOTTOM_SHEET: {
  const bottomSheetOptions = overlayState.options as BottomSheetOptions;
  return (
    <Drawer open={overlayState.isOpen} onClose={closeOverlay}>
      <DrawerContent
        style={{
          maxHeight: bottomSheetOptions.height === 'large' ? '95vh' : '80vh',
          minHeight: bottomSheetOptions.height === 'large' ? '95vh' : 'auto',
        }}
      >
        <div className="flex flex-col items-center">
          {bottomSheetOptions.title && (
            <h2 className="text-[18px] font-semibold mb-4 text-center">{bottomSheetOptions.title}</h2>
          )}
          <div className="w-full text-center">{overlayState.content as ReactNode}</div>
          {bottomSheetOptions.buttons?.map((button, index) => (
            <Button key={index} variantType={button.variant || 'primary'} onClick={button.onClick} fullWidth
              className={`mt-2 ${button.height === 'large' ? 'py-4' : 'py-2'}`}>
              {button.text}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
```

### 13-3. `src/widgets/startup-popup/ui/StartupPopup.tsx`

이미지 팝업이므로 Drawer 대신 shadcn Dialog 사용 (중앙 모달):

```tsx
// 제거
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

// 추가
import { Dialog, DialogContent } from '@/shared/ui/dialog';

// <Dialog open={isOpen} onClose={handleClose} PaperProps={{...}} sx={{...}}>
// →
// <Dialog open={shouldRenderPopup} onOpenChange={(open) => !open && handleClose()}>
//   <DialogContent className="p-0 bg-transparent shadow-none border-0 max-w-[360px] w-[80%] overflow-visible">
```

버튼은 native button으로 (STEP 8에서 이미 교체됨):
```tsx
<div className="flex justify-between w-full mt-[13.5px] pr-4 pl-8">
  <button type="button" onClick={handleDontShowAgain} className="text-white text-sm">7일간 보지 않기</button>
  <button type="button" onClick={handleClose} className="text-white text-sm">닫기</button>
</div>
```

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: MUI Dialog(바텀시트) → shadcn Drawer (STEP 13)"
```

---

## STEP 14: App.tsx 정리

### 14-1. ThemeProvider, LocalizationProvider 제거

`src/app/App.tsx`:

```tsx
// 제거
import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';

const theme = createTheme({ ... });

// JSX에서 ThemeProvider, LocalizationProvider 래퍼 제거
```

dayjs 한국어 로케일 설정은 `main.tsx` 또는 Calendar를 사용하는 컴포넌트에서 직접:
```tsx
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
```

### 검증 및 커밋

```bash
yarn typecheck
git add -p
git commit -m "refactor: ThemeProvider/LocalizationProvider 제거 (STEP 14)"
```

---

## STEP 15: tailwind.config.js `important: true` 제거

```js
// tailwind.config.js
module.exports = {
  // 제거: important: true,
  ...
}
```

MUI가 없으므로 `!important` 충돌 없음. 제거 후 스타일이 깨지는 곳이 있다면 해당 Tailwind 클래스에 `!` prefix 추가 (e.g., `!text-white`).

### 검증 및 커밋

```bash
yarn typecheck
git add tailwind.config.js
git commit -m "refactor: tailwind important:true 제거 (STEP 15)"
```

---

## STEP 16: 패키지 제거 및 최종 검증

### 16-1. 잔존 MUI/Emotion import 확인

```bash
grep -r "@mui/" src/ --include="*.tsx" --include="*.ts" -l
grep -r "@emotion/" src/ --include="*.tsx" --include="*.ts" -l
```

결과가 0개여야 함. 있으면 해당 파일 수정 후 재확인.

### 16-2. 패키지 제거

```bash
yarn remove @mui/material @mui/x-date-pickers @emotion/react @emotion/styled
```

### 16-3. 최종 타입 검사

```bash
yarn typecheck
```

타입 에러 0개 확인.

### 16-4. 최종 커밋

```bash
git add package.json yarn.lock
git commit -m "chore: @mui, @emotion 패키지 제거 완료 (STEP 16)"
```

---

## 검수 체크리스트

### 타입/빌드
- [ ] `yarn typecheck` — 타입 에러 0개
- [ ] `grep -r "@mui/" src/ -l` — 0개
- [ ] `grep -r "@emotion/" src/ -l` — 0개
- [ ] `tailwind.config.js` `important: true` 제거 확인

### 육안 검수 (주요 화면)
- [ ] 버튼 variant (primary, secondary, line, gray)
- [ ] 탭 전환 및 active indicator
- [ ] 스위치 토글
- [ ] 체크박스 체크/해제
- [ ] 라디오 그룹 선택
- [ ] Input 상태 (default, error, success) + 아이콘 adornment
- [ ] 바텀시트 열기 / 드래그 닫기 / 버튼 닫기
- [ ] 모달 confirm / alert
- [ ] 날짜 선택 (Calendar: 오늘 표시, 비활성 날짜, 선택 상태)
- [ ] StartupPopup 팝업
- [ ] 지점 이미지 캐러셀 (전체화면)
- [ ] 네비게이션 바 OPEN 뱃지

---

## 참고: MUI → shadcn 교체 매핑 전체

| MUI | shadcn | STEP |
|---|---|---|
| `Button` | `Button` (커스텀 variant 추가) | 5 |
| `Tab`, `Tabs` | `Tabs`, `TabsList`, `TabsTrigger` | 6 |
| `Radio`, `RadioGroup` | `RadioGroup`, `RadioGroupItem` | 7 |
| `Checkbox` | `Checkbox` | 8 |
| `Switch` | `Switch` | 9 |
| `TextField` (input) | `Input` | 10 |
| `TextField` (textarea) | `Textarea` | 10 |
| `DateCalendar` | `Calendar` (react-day-picker) | 11 |
| `Dialog` (모달) | `Dialog` | 12 |
| `Dialog` (바텀시트) | `Drawer` (vaul, 드래그 내장) | 13 |
| `Dialog` (전체화면) | `Dialog` fullscreen | 12 |
| `Divider` | `Separator` | 2 |
| `Skeleton` | `Skeleton` | 3 |
| `CircularProgress` | `Loader2` + `animate-spin` | 3 |
| `IconButton` | `Button variant="ghost" size="icon"` | 4 |
| `Box`, `Container`, `Stack` | HTML `div` | 1 |
| `Typography` | HTML `p`, `span`, `h*` | 1 |
| `SvgIcon` | SVG import (`?react`) | 4 |
| `styled`, `createTheme`, `ThemeProvider` | 제거 (CSS variables) | 14 |
| `LocalizationProvider`, `AdapterDayjs` | 제거 | 14 |
