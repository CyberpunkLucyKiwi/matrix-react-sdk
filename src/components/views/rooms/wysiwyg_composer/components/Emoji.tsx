/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";

import { AboveLeftOf } from "../../../../structures/ContextMenu";
import { EmojiButton } from "../../EmojiButton";
import dis from "../../../../../dispatcher/dispatcher";
import { ComposerInsertPayload } from "../../../../../dispatcher/payloads/ComposerInsertPayload";
import { Action } from "../../../../../dispatcher/actions";
import { useRoomContext } from "../../../../../contexts/RoomContext";
import { useComposerContext } from "../ComposerContext";
import { setSelection } from "../utils/selection";

interface EmojiProps {
    menuPosition: AboveLeftOf;
}

export function Emoji({ menuPosition }: EmojiProps) {
    const roomContext = useRoomContext();
    const composerContext = useComposerContext();

    return (
        <EmojiButton
            menuPosition={menuPosition}
            addEmoji={(emoji) => {
                setSelection(composerContext.selection).then(() =>
                    dis.dispatch<ComposerInsertPayload>({
                        action: Action.ComposerInsert,
                        text: emoji,
                        timelineRenderingType: roomContext.timelineRenderingType,
                    }),
                );
                return true;
            }}
        />
    );
}
