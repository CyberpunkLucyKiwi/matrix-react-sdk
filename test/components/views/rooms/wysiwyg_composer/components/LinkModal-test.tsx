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

import { FormattingFunctions } from "@matrix-org/matrix-wysiwyg";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";

import { LinkModal } from "../../../../../../src/components/views/rooms/wysiwyg_composer/components/LinkModal";
import { mockPlatformPeg } from "../../../../../test-utils";
import * as selection from "../../../../../../src/components/views/rooms/wysiwyg_composer/utils/selection";
import { SubSelection } from "../../../../../../src/components/views/rooms/wysiwyg_composer/types";

describe("LinkModal", () => {
    const formattingFunctions = {
        link: jest.fn(),
    } as unknown as FormattingFunctions;
    const defaultValue: SubSelection = {
        focusNode: null,
        anchorNode: null,
        focusOffset: 3,
        anchorOffset: 4,
    };

    const customRender = (isTextEnabled: boolean, onClose: () => void) => {
        return render(
            <LinkModal
                composer={formattingFunctions}
                isTextEnabled={isTextEnabled}
                onClose={onClose}
                composerContext={{ selection: defaultValue }}
            />,
        );
    };

    const selectionSpy = jest.spyOn(selection, "setSelection");

    beforeEach(() => mockPlatformPeg({ overrideBrowserShortcuts: jest.fn().mockReturnValue(false) }));
    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it("Should create a link", async () => {
        // When
        const onClose = jest.fn();
        customRender(false, onClose);

        // Then
        expect(screen.getByLabelText("Link")).toBeTruthy();
        expect(screen.getByText("Save")).toBeDisabled();

        // When
        await userEvent.type(screen.getByLabelText("Link"), "l");

        // Then
        await waitFor(() => {
            expect(screen.getByText("Save")).toBeEnabled();
            expect(screen.getByLabelText("Link")).toHaveAttribute("value", "l");
        });

        // When
        jest.useFakeTimers();
        screen.getByText("Save").click();

        // Then
        expect(selectionSpy).toHaveBeenCalledWith(defaultValue);
        await waitFor(() => expect(onClose).toBeCalledTimes(1));

        // When
        jest.runAllTimers();

        // Then
        expect(formattingFunctions.link).toHaveBeenCalledWith("l", undefined);
    });

    it("Should create a link with text", async () => {
        // When
        const onClose = jest.fn();
        customRender(true, onClose);

        // Then
        expect(screen.getByLabelText("Text")).toBeTruthy();
        expect(screen.getByLabelText("Link")).toBeTruthy();
        expect(screen.getByText("Save")).toBeDisabled();

        // When
        await userEvent.type(screen.getByLabelText("Text"), "t");

        // Then
        await waitFor(() => {
            expect(screen.getByText("Save")).toBeDisabled();
            expect(screen.getByLabelText("Text")).toHaveAttribute("value", "t");
        });

        // When
        await userEvent.type(screen.getByLabelText("Link"), "l");

        // Then
        await waitFor(() => {
            expect(screen.getByText("Save")).toBeEnabled();
            expect(screen.getByLabelText("Link")).toHaveAttribute("value", "l");
        });

        // When
        jest.useFakeTimers();
        screen.getByText("Save").click();

        // Then
        expect(selectionSpy).toHaveBeenCalledWith(defaultValue);
        await waitFor(() => expect(onClose).toBeCalledTimes(1));

        // When
        jest.runAllTimers();

        // Then
        expect(formattingFunctions.link).toHaveBeenCalledWith("l", "t");
    });
});
