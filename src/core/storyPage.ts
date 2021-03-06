/*
 * Tezos-monsters - play game to lean Ligo and Tezos
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import {Answer} from "./answer";

export interface StoryPage {

     id: string;
     step: number;
     header: string;
     text : string;
     image: string;
     isCodePage: boolean;
     isMonsterPage: boolean;
     initialCode?: string;
     contractName?: string;
     answers: Answer[];


}

export const StoryNewDefault : StoryPage = {
     id: 'new',
     step: 1,
     header: 'New Story',
     text: '',
     image: '',
     isMonsterPage: false,
     isCodePage: false,
     answers: []
}
