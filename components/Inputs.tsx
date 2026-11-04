'use client';
import { useField } from "formik";
import { cn } from "@libs/utils";
import dynamic from 'next/dynamic'
import { createClient } from '@libs/supabase/client';
import type { FormInput } from '../types';

const Select = dynamic(() => import('react-select'), { ssr: false })
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false })

const fieldInput = "grow w-full border-b-2 border-primary px-0 py-1 text-left font-normal text-primary";

interface InputsProps {
    input: FormInput;
    [key: string]: any;
}

export const Inputs = ({ input, ...props}: InputsProps) => {
    const { name, type, placeholder, prefix, suffix, options, required, handler, description} = input;
    const [field, meta, helpers] = useField(props as any);
    const { setValue } = helpers;
    let inputType: React.ReactNode;
    switch (type) {
        case "text":
            inputType = (
                <textarea
                className={fieldInput}
                placeholder={placeholder as string}
                {...field}
                {...props}
                />
            );
            break;
        case "shortText":
            inputType = (
                <input
                    className={fieldInput}
                    placeholder={placeholder as string}
                    {...field}
                    {...props}
                />
            );
            break;
        case "checkbox":
            inputType = (
                <input
                    type={"checkbox"}
                    className={fieldInput}
                    placeholder={placeholder as string}
                    {...field}
                    {...props}
                />
            );
            break;
        case "adress":
            inputType = (<input
                    className={fieldInput}
                    placeholder={placeholder as string}
                    autoComplete="street-address"
                    {...field}
                    {...props}
                />);
            break;
        case "url":
            inputType = (<input
                    type="url"
                    className={fieldInput}
                    placeholder={placeholder as string}
                    {...field}
                    {...props}
                    />
            );
            break;
        case "mail":
            inputType = (<input
                        type ="email"
                        className={fieldInput}
                        placeholder={placeholder as string}
                        {...field}
                        {...props}
                        />);
            break;
        case "number":
            inputType = (<input
                        type="number"
                        className={fieldInput}
                        placeholder={placeholder as string}
                        {...field}
                        {...props}
                    />)
            break;
        case "date":
            inputType = (<input
                        type="date"
                        className={fieldInput}
                        placeholder={placeholder as string}
                        {...field}
                        {...props}
                    />)
            break;
        case "images":
            inputType = (
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className={fieldInput}
                    onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        const supabase = createClient();
                        const urls: string[] = [];
                        for (const file of Array.from(files)) {
                            const filePath = `drafts/${Date.now()}-${file.name}`;
                            const { data, error } = await supabase.storage
                                .from('illustrations')
                                .upload(filePath, file);
                            if (error) {
                                console.error('Upload error:', error);
                                continue;
                            }
                            const { data: urlData } = supabase.storage
                                .from('illustrations')
                                .getPublicUrl(data.path);
                            urls.push(urlData.publicUrl);
                        }
                        setValue([...field.value, ...urls]);
                    }}
                />
            )
            break;
        case "button":
            return (
                <div className="relative mb-8 flex flex-col justify-stretch [&_button]:rounded-none [&_button]:bg-primary">
                    <div
                        className="link font-bold"
                        onClick={() => { setValue(handler![0](handler![1]())) }}
                    >
                        {prefix && (<span className="font-bold">{prefix} {required && (<strong className="text-red-700">*</strong>)}</span>)}
                    </div>
                </div>
            )
            break;
        case "select":
            inputType = (<Select
                        className={fieldInput}
                        classNamePrefix="select"
                        value={options ? options.find((option: any) => option.value === field.value) : ''}
                        onChange={(option: any) => {setValue(option.value)}}
                        onBlur={field.onBlur}
                        options={options}
                    />)
            break;
        case "creatableSelect":
            inputType = (<CreatableSelect
                        className={fieldInput}
                        classNamePrefix="select"
                        isMulti
                        onChange={(values: any) => { setValue(values)}}
                        options={options}
                    />)
            break;
        case "multiSelect":
            inputType = (<Select
                    className={fieldInput}
                    styles={{padding:"0 !important"} as any}
                    classNamePrefix="select"
                    isMulti
                    onChange={(values: any) => {setValue(values.map((el: any) => el.value))}}
                    onBlur={field.onBlur}
                    options={options}
                />)
            break;
        default:
            console.log(`Unsupported input (${type})`);
            inputType = ``;
    }
return (
    <div className={cn(
        "relative mb-8 flex flex-col justify-stretch [&_button]:rounded-none [&_button]:bg-primary",
        type === "text" && "[&_textarea]:w-full! [&_textarea]:text-left",
        type === "checkbox" && "[&_input]:size-[20px] [&_input]:grow-0"
    )}>
        {meta.touched && meta.error ? (<div className="absolute -bottom-4 w-full text-[0.8em] text-red-700">{meta.error}</div>) : null}
        {prefix && (<span className="font-bold">{prefix} {required && (<strong className="text-red-700">*</strong>)}</span>)}
        {description && (<span className="font-normal opacity-80">{description} </span>)}
        <div className="relative my-2 flex flex-row justify-stretch">
            {inputType}
            {suffix && (<label className="ml-2 font-bold">{suffix}</label>)}
        </div>

    </div>)
}
