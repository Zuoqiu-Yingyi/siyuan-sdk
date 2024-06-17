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
 * along with this program.  If not, see {@link http://www.gnu.org/licenses/}.
 */

//#region content
/**
 * Packages the specified files and folders as *.zip files and returns their download
 * addresses
 */
export interface IPayload {
    /**
     * main name of the zip file created
     */
    name?: string;
    /**
     * path list of files and folders
     */
    paths: string[];
}

//#endregion content
