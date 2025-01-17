// Copyright (C) 2023 SiYuan Community
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { describe } from "vitest";

import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import type openRepoSnapshotDoc from "@/types/kernel/api/repo/openRepoSnapshotDoc";

const pathname = client.Client.api.repo.openRepoSnapshotDoc.pathname;

interface ICase {
    name: string;
    before?: () => void;
    payload: openRepoSnapshotDoc.IPayload;
    after?: (response: openRepoSnapshotDoc.IResponse, payload?: openRepoSnapshotDoc.IPayload) => void;
    debug: boolean;
}

describe(pathname, async () => {
    const schema_payload = new SchemaJSON(SchemaJSON.resolvePayloadSchemaPath(pathname));
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_payload.loadSchemaFile();
    await schema_response.loadSchemaFile();
    const validate_payload = schema_payload.constructValidateFuction();
    const validate_response = schema_response.constructValidateFuction();

    const cases: ICase[] = [
        {
            name: "text file",
            payload: {
                id: "330eac64dcdbd90845a424084841c04ee37403be",
            },
            debug: false,
        },
        {
            name: "binary file",
            payload: {
                id: "794ac3d96ff5fa6cb05fffd18083cf5fc94865fe",
            },
            debug: false,
        },
        {
            name: "document file",
            payload: {
                id: "ca4a1361d9fb83e3d418f2fc8436efe18270cb15",
            },
            debug: false,
        },
    ];

    cases.forEach((item) => {
        testKernelAPI<openRepoSnapshotDoc.IPayload, openRepoSnapshotDoc.IResponse>({
            name: item.name,
            payload: {
                data: item.payload,
                validate: validate_payload,
                test: item.before,
            },
            request: (payload) => client.client.openRepoSnapshotDoc(payload!),
            response: {
                validate: validate_response,
                test: item.after,
            },
            debug: item.debug,
        });
    });
});
