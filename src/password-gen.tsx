import { createMemo, createSignal } from 'solid-js';

const random = (min:number, max:number):number => Math.floor(Math.random() * (max - min)) + min;

export const PasswordGen = () => {

    const [getToggle, setToggle] = createSignal<boolean>(false);
    const [getLowercase, setLowercase] = createSignal<boolean>(true);
    const [getUppercase, setUppercase] = createSignal<boolean>(false);
    const [getDigits, setDigits] = createSignal<boolean>(false);
    const [getSpecial, setSpecial] = createSignal<boolean>(false);
    const [getLength, setLength] = createSignal<number>(16);

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!$%&#?';

    const value = createMemo<string>(() => {
        const useLowercase = getLowercase();

        let v = '';
        if (useLowercase) {
            v += lowercase;
        }

        const useUppercase = getUppercase();
        if (useUppercase) {
            v += uppercase;
        }

        const useDigits = getDigits();
        if (useDigits) {
            v += digits;
        }

        const useSpecial = getSpecial();
        if (useSpecial) {
            v += special;
        }

        return v;
    });

    const s = createMemo<string>(() => {
        const result:string[] = [];

        const values = value().split('');

        const length = getLength();

        for (let index = 0; index < length; index++) {
            const p = random(0, values.length)
            result.push(values[p]);
        }

        getToggle();
    
        return result.join('');
    });

    return (
        <>
            <div>
                <label>lowercase</label>
                <input type="checkbox" checked={getLowercase()} onChange={() => setLowercase(v => !v)} />
            </div>
            <div>
                <label>uppercase</label>
                <input type="checkbox" checked={getUppercase()} onChange={() => setUppercase(v => !v)} />
            </div>
            <div>
                <label>digits</label>
                <input type="checkbox" checked={getDigits()} onChange={() => setDigits(v => !v)} />
            </div>
            <div>
                <label>special</label>
                <input type="checkbox" checked={getSpecial()} onChange={() => setSpecial(v => !v)} />
            </div>
            <div>
                <label for="volume">length ({getLength()})</label>
                <input type="range" min="3" max="64" value={getLength()} onChange={(e) => setLength(v => e.currentTarget.value)} />
            </div>
            <div>
                <button onClick={() => setToggle(toggle => !toggle)}>Generate</button>
            </div>
            <div>
                <input type="text" value={s()} style="width: 100%" />
            </div>
        </>
    )
}