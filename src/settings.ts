export type DisplaySettings={naturalStyle:'filled'|'hollow';invertColors:boolean};
export const defaultSettings=():DisplaySettings=>({naturalStyle:'filled',invertColors:false});
export function restoreSettings(value:unknown):DisplaySettings{
 const v=value&&typeof value==='object'?value as Partial<DisplaySettings>:{};
 return {naturalStyle:v.naturalStyle==='hollow'?'hollow':'filled',invertColors:v.invertColors===true};
}
