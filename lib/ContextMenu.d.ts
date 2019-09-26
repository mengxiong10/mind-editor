/// <reference types="react" />
import { OverlayMenuItem } from './components/OverlayMenu';
interface ContextMenuProps {
    items?: OverlayMenuItem[];
    placement?: 'bottomLeft' | 'bottomRight';
    event?: string;
}
declare function ContextMenu({ placement, event, items }: ContextMenuProps): JSX.Element;
export default ContextMenu;
