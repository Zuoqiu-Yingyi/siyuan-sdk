/**
 * Copyright (C) 2023 SiYuan Community
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
    describe,
    expect,
    test,
} from "vitest";

import { KernelError } from "~/src";
import client from "~/tests/utils/client";
import { SchemaJSON } from "~/tests/utils/schema";
import { testKernelAPI } from "~/tests/utils/test";

import logoutAuth from "@/types/kernel/api/system/logoutAuth";

const pathname = client.Client.api.system.logoutAuth.pathname;

describe(pathname, async () => {
    const schema_response = new SchemaJSON(SchemaJSON.resolveResponseSchemaPath(pathname));
    await schema_response.loadSchemaFile();
    const validate_response = schema_response.constructValidateFuction();

    testKernelAPI<never, logoutAuth.IResponse>({
        name: "main",
        request: () => client.client.logoutAuth(),
        catch: (error) => {
                /* 测试错误信息 (未设置访问鉴权码) */
                test(`test error info (No authentication code)`, async () => {
                    expect(
                        error,
                        "error instance of KernelError",
                    ).instanceOf(KernelError);
                    expect(
                        (error as KernelError).data,
                        "response data include closeTimeout property",
                    ).toHaveProperty("closeTimeout", 5000);
                });
        },
        response: {
            validate: validate_response,
        },
    });
});
