/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @see https://github.com/blacksmoke26/dawn-of-man-generator
 * @since 2020-08-29
 */

import React from 'react';
import merge from 'deepmerge';

import {
  AmpersandIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpWideNarrowIcon,
  BlendIcon,
  BlocksIcon,
  BrainCircuitIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeXmlIcon,
  CopyIcon,
  DownloadIcon,
  EqualNotIcon,
  EraserIcon,
  FileInputIcon,
  Flower2Icon,
  HammerIcon,
  LeafIcon,
  type LucideProps,
  MapPinIcon,
  MilestoneIcon,
  MountainIcon,
  PencilLineIcon,
  PlusIcon,
  PowerIcon,
  PowerOffIcon,
  RotateCcwIcon,
  ShuffleIcon,
  SnowflakeIcon,
  SproutIcon,
  SquareChevronDownIcon,
  SquareChevronUpIcon,
  SquareXIcon,
  SunIcon,
  SwordsIcon,
  ThermometerSnowflakeIcon,
  TreesIcon,
  VeganIcon,
  WandSparklesIcon,
  WorkflowIcon,
  XIcon,
} from 'lucide-react';

export const COLOR_DISABLED: string = 'rgba(255, 255, 255, .5';

export const COLOR_WHITISH: string = '#eaeaea';

export const COLOR_REDDISH: string = '#ff8a65';

export const COLOR_GRAYED: string = 'rgba(255, 255, 255, .4';

export const iconDefaultProps: Partial<LucideProps> = {
  className: 'd-inline position-relative',
  height: 14,
  width: 14,
  style: {top: -1},
};

export const IconShuffle = (props: LucideProps) => (
  <ShuffleIcon {...merge(iconDefaultProps, props)}/>
);

export const IconRestore = (props: LucideProps) => (
  <RotateCcwIcon {...merge(iconDefaultProps, props)}/>
);

export const IconClear = (props: LucideProps) => (
  <XIcon {...merge(iconDefaultProps, props)}/>
);

export const IconSquareMinus = (props: LucideProps) => (
  <SquareXIcon {...merge(iconDefaultProps, props)}/>
);

export const IconBlock = (props: LucideProps) => (
  <BlocksIcon {...merge(iconDefaultProps, props)}/>
);

export const IconNew = (props: LucideProps) => (
  <PlusIcon {...merge(iconDefaultProps, props)}/>
);

export const IconMapPin = (props: LucideProps) => (
  <MapPinIcon {...merge(iconDefaultProps, props)}/>
);

export const IconSpring = (props: LucideProps) => (
  <Flower2Icon {...merge(iconDefaultProps, props)}/>
);

export const IconFall = (props: LucideProps) => (
  <LeafIcon {...merge(iconDefaultProps, props)}/>
);

export const IconWinter = (props: LucideProps) => (
  <SnowflakeIcon {...merge(iconDefaultProps, props)}/>
);

export const IconSummer = (props: LucideProps) => (
  <SunIcon {...merge(iconDefaultProps, props)}/>
);

export const IconTree = (props: LucideProps) => (
  <TreesIcon {...merge(iconDefaultProps, props)}/>
);

export const IconPlant = (props: LucideProps) => (
  <SproutIcon {...merge(iconDefaultProps, props)}/>
);

export const IconMountain = (props: LucideProps) => (
  <MountainIcon {...merge(iconDefaultProps, props)}/>
);

export const IconHammer = (props: LucideProps) => (
  <HammerIcon {...merge(iconDefaultProps, props)}/>
);

export const IconStorm = (props: LucideProps) => (
  <ThermometerSnowflakeIcon {...merge(iconDefaultProps, props)}/>
);

export const IconCondition = (props: LucideProps) => (
  <BrainCircuitIcon {...merge(iconDefaultProps, props)}/>
);


export const IconConditionLogical = (props: LucideProps) => (
  <WorkflowIcon {...merge(iconDefaultProps, props)}/>
);

export const IconConditionAnd = (props: LucideProps) => (
  <AmpersandIcon {...merge(iconDefaultProps, props)}/>
);

export const IconConditionOr = (props: LucideProps) => (
  <BlendIcon {...merge(iconDefaultProps, props)}/>
);

export const IconConditionNot = (props: LucideProps) => (
  <EqualNotIcon {...merge(iconDefaultProps, props)}/>
);

export const IconChevronUp = (props: LucideProps) => (
  <SquareChevronUpIcon {...merge(iconDefaultProps, props)}/>
);

export const IconChevronDown = (props: LucideProps) => (
  <SquareChevronDownIcon {...merge(iconDefaultProps, props)}/>
);

export const IconChevronSimpleUp = (props: LucideProps) => (
  <ChevronUpIcon {...merge(iconDefaultProps, props)}/>
);

export const IconChevronSimpleDown = (props: LucideProps) => (
  <ChevronDownIcon {...merge(iconDefaultProps, props)}/>
);

export const IconMilestone = (props: LucideProps) => (
  <MilestoneIcon {...merge(iconDefaultProps, props)}/>
);

export const IconCopy = (props: LucideProps) => (
  <CopyIcon {...merge(iconDefaultProps, props)}/>
);

export const IconDownload = (props: LucideProps) => (
  <DownloadIcon {...merge(iconDefaultProps, props)}/>
);

export const IconImport = (props: LucideProps) => (
  <FileInputIcon {...merge(iconDefaultProps, props)}/>
);

export const IconEraser = (props: LucideProps) => (
  <EraserIcon {...merge(iconDefaultProps, props)}/>
);

export const IconWandSparkles = (props: LucideProps) => (
  <WandSparklesIcon {...merge(iconDefaultProps, props)}/>
);

export const IconCheck = (props: LucideProps) => (
  <CheckIcon {...merge(iconDefaultProps, props)}/>
);

export const IconCodeXml = (props: LucideProps) => (
  <CodeXmlIcon {...merge(iconDefaultProps, props)}/>
);

export const IconEnvironment = (props: LucideProps) => (
  <VeganIcon {...merge(iconDefaultProps, props)}/>
);

export const IconScenario = (props: LucideProps) => (
  <SwordsIcon {...merge(iconDefaultProps, props)}/>
);

export const IconPencilLine = (props: LucideProps) => (
  <PencilLineIcon {...merge(iconDefaultProps, props)}/>
);

export const IconRaiseUp = (props: LucideProps) => (
  <ArrowUpWideNarrowIcon {...merge(iconDefaultProps, props)}/>
);

export const IconRaiseDown = (props: LucideProps) => (
  <ArrowDownWideNarrowIcon {...merge(iconDefaultProps, props)}/>
);

export const IconEnabled = (props: LucideProps) => (
  <PowerIcon {...merge(iconDefaultProps, props)}/>
);

export const IconDisabled = (props: LucideProps) => (
  <PowerOffIcon {...merge(iconDefaultProps, props)}/>
);
