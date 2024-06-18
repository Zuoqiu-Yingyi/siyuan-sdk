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

// #region content
/**
 * Get document history content from history document file absolute path
 */
export interface IResponse {
    /**
     * status code
     */
    code: number;
    data: IData;
    /**
     * status message
     */
    msg: string;
}

/**
 * Response information
 */
export interface IData {
    /**
     * document content
     */
    content: string;
    /**
     * Block ID
     */
    id: string;
    /**
     * is a large document?
     * large document return markdown
     * others return block DOM
     */
    isLargeDoc: boolean;
    /**
     * Document block ID
     */
    rootID: string;
}

// #endregion content
