// @ts-nocheck
'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { MultiSelectCombobox } from "./multi-select";
import { Textarea } from "./ui/textarea";
import { CustomProps, FormFieldType } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRephraseTextMutation } from "@/store/api";
import { TextEnhancerWidget } from "./text-enhancer-widget";

interface RenderFieldProps {
  field: {
    onChange: (value: any) => void;
    onBlur: () => void;
    name: string;
    value: any;
  };
  props: CustomProps;
}

const RenderField = ({ props, field }: RenderFieldProps) => {
  const { fieldType, placeholder, iconSrc, inputType, options = [] } = props;
  const [togglePassword, setTogglePassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState<string>('Concise');
  const [originalText, setOriginalText] = useState<string | null>(null);
  const originalSnapshot = useRef<string | null>(null);
  const [rephraseText, { isLoading }] = useRephraseTextMutation();
  const tones = useMemo(() => ([
    'Formal',
    'Casual',
    'Concise',
    'Academic',
    'Friendly',
    'Persuasive',
  ]), []);

  const handleToggle = () => {
    setTogglePassword((prev) => !prev);
  };

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="relative">
          {iconSrc && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              {iconSrc}
            </span>
          )}
          <FormControl>
            <Input
              {...field}
              type={inputType === "password" ? (togglePassword ? "text" : "password") : (inputType || "text")}
              placeholder={placeholder}
              className={iconSrc
                ? "pl-12 h-12 bg-[#F5F5F7] border-none rounded-xl text-base focus-visible:ring-primary"
                : "bg-[#F5F5F7] border-none rounded-xl h-12 focus-visible:ring-primary"}
            />
          </FormControl>
          {inputType === "password" && (
            <button
              type="button"
              onClick={handleToggle}
              aria-label="Change Password Visibility"
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-all"
            >
              {togglePassword ? <EyeOff size={20} className="text-neutral-400" /> : <Eye size={20} className="text-neutral-400" />}
            </button>
          )}
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="bg-[#F5F5F7] border-none rounded-xl h-12">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="rounded-xl border-none shadow-xl bg-white">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="rounded-lg cursor-pointer hover:bg-neutral-50">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case FormFieldType.MULTI_SELECT:
      return (
        <FormControl>
          <MultiSelectCombobox
            options={options}
            selected={Array.isArray(field.value) ? field.value : []}
            onChange={(val) => field.onChange(val)}
            placeholder={placeholder}
            className="bg-[#F5F5F7] border-none rounded-xl h-12 text-left font-normal"
          />
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return field.name === 'description' ? (
        <div className="flex flex-col">
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              className="bg-[#F5F5F7] border-none rounded-xl p-4 focus-visible:ring-primary min-h-[120px]"
            />
          </FormControl>
          <TextEnhancerWidget
            value={String(field.value || '')}
            onChange={(next) => field.onChange(next)}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FormControl>
              <Textarea
                {...field}
                placeholder={placeholder}
                className="bg-[#F5F5F7] border-none rounded-xl p-4 focus-visible:ring-primary min-h-[120px]"
              />
            </FormControl>
            <div className="ml-3 flex items-center gap-2">
              {originalText && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    field.onChange(originalText);
                    setOriginalText(null);
                    originalSnapshot.current = null;
                  }}
                  className="h-8 rounded-lg"
                >
                  Revert
                </Button>
              )}
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg"
                  >
                    Change Tone
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 rounded-xl">
                  <div className="space-y-3">
                    <Select onValueChange={(v) => setTone(v)} defaultValue={tone}>
                      <SelectTrigger className="bg-[#F5F5F7] border-none rounded-xl h-10">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-xl">
                        {tones.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      disabled={isLoading || !String(field.value || '').trim()}
                      className="w-full h-10 bg-primary text-white rounded-xl"
                      onClick={async () => {
                        try {
                          const current = String(field.value || '');
                          if (!originalSnapshot.current) {
                            originalSnapshot.current = current;
                            setOriginalText(current);
                          }
                          const res = await rephraseText({ text: current, tone }).unwrap();
                          field.onChange(res.text);
                          setIsOpen(false);
                        } catch (e) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {isLoading ? 'Rephrasing...' : 'Apply'}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};


const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1'>
          {label && (
            <FormLabel className="text-sm font-semibold text-[#030229]">{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="text-[10px] text-red-500 font-medium mt-1" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
