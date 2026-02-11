'use client';
import styles from "@styles/components/Inputs.module.css";
import { useField } from "formik";
import { Widget as UploadcareWidget } from "@uploadcare/react-widget";
const Widget = UploadcareWidget as any;
import classNames from "classnames";
import dynamic from 'next/dynamic'
import type { FormInput } from '../types';

const Select = dynamic(() => import('react-select'), { ssr: false })
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false })

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
                className={styles.field__input}
                placeholder={placeholder as string}
                {...field}
                {...props}
                />
            );
            break;
        case "shortText":
            inputType = (
                <input
                    className={styles.field__input}
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
                    className={styles.field__input}
                    placeholder={placeholder as string}
                    {...field}
                    {...props}
                />
            );
            break;
        case "adress":
            inputType = (<input
                    className={styles.field__input}
                    placeholder={placeholder as string}
                    autoComplete="street-address"
                    {...field}
                    {...props}
                />);
            break;
        case "url":
            inputType = (<input
                    type="url"
                    className={styles.field__input}
                    placeholder={placeholder as string}
                    {...field}
                    {...props}
                    />
            );
            break;
        case "mail":
            inputType = (<input
                        type ="email"
                        className={styles.field__input}
                        placeholder={placeholder as string}
                        {...field}
                        {...props}
                        />);
            break;
        case "number":
            inputType = (<input
                        type="number"
                        className={styles.field__input}
                        placeholder={placeholder as string}
                        {...field}
                        {...props}
                    />)
            break;
        case "date":
            inputType = (<input
                        type="date"
                        className={styles.field__input}
                        placeholder={placeholder as string}
                        {...field}
                        {...props}
                    />)
            break;
        case "images":
            inputType = (<Widget
                    publicKey='584b21c2b769b392a273'
                    imageShrink="1024x1024"
                    clearable
                    locale="fr"
                    previewStep='true'
                    multiple='true'
                    onChange={(info: any) => {
                        let urls: string[] = [];
                        for (let url = 0; url < info.count; url++) {
                            urls.push(`${info.cdnUrl}nth/${url}/`)
                        }
                        setValue(urls)
                    }}
                />
            )
            break;
        case "button":
            return (
                <div className={classNames(styles.field, styles[type])}>
                    <div
                        className={classNames(styles.field__prefix, "link")}
                        onClick={() => { setValue(handler![0](handler![1]())) }}
                    >
                        {prefix && (<span className={styles.field__prefix}>{prefix} {required && (<strong className={styles.required}>*</strong>)}</span>)}
                    </div>
                </div>
            )
            break;
        case "select":
            inputType = (<Select
                        className={styles.field__input}
                        classNamePrefix="select"
                        value={options ? options.find((option: any) => option.value === field.value) : ''}
                        onChange={(option: any) => {setValue(option.value)}}
                        onBlur={field.onBlur}
                        options={options}
                    />)
            break;
        case "creatableSelect":
            inputType = (<CreatableSelect
                        className={styles.field__input}
                        classNamePrefix="select"
                        isMulti
                        onChange={(values: any) => { setValue(values)}}
                        options={options}
                    />)
            break;
        case "multiSelect":
            inputType = (<Select
                    className={styles.field__input}
                    styles={{padding:"0 !important"} as any}
                    classNamePrefix="select"
                    // value={options ? options.find(option => option.value === field.value) : ''}
                    isMulti
                    onChange={(values: any) => {setValue(values.map((el: any) => el.value))}}
                    onBlur={field.onBlur}
                    options={options}
                />)
            break;
        default:
            console.log(`❌ Unsupported input (${type})`);
            inputType = ``;
    }
return (
    <div className={classNames(styles.field, styles[type])}>
        {meta.touched && meta.error ? (<div className={styles.field__error}>{meta.error}</div>) : null}
        {prefix && (<span className={styles.field__prefix}>{prefix} {required && (<strong className={styles.required}>*</strong>)}</span>)}
        {description && (<span className={styles.field__description}>{description} </span>)}
        <div className={styles.field__area}>
            {inputType}
            {suffix && (<label className={styles.field__suffix}>{suffix}</label>)}
        </div>

    </div>)
}
