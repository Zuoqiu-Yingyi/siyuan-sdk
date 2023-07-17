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

/**
 * Get block breadcrumb
 */
export interface IPayload {
    /**
     * The block types that needs to be excluded
     */
    excludeTypes?: ExcludeType[];
    /**
     * Block ID
     */
    id: string;
}

/**
 * Block type
 */
export type ExcludeType = "NodeDocument" | "NodeSuperBlock" | "NodeBlockquote" | "NodeList" | "NodeListItem" | "NodeHeading" | "NodeParagraph" | "NodeMathBlock" | "NodeTable" | "NodeCodeBlock" | "NodeHTMLBlock" | "NodeThematicBreak" | "NodeAudio" | "NodeVideo" | "NodeIFrame" | "NodeWidget" | "NodeBlockQueryEmbed";
