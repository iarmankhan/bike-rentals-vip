import { FC, useState, MouseEvent } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ActionMenuProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
  moreActions?: {
    label: string;
    onClick: () => void;
  }[];

  hideDelete?: boolean;
}

const ActionMenu: FC<ActionMenuProps> = ({
  onEditClick,
  onDeleteClick,
  moreActions = [],
  hideDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="action-button"
        aria-controls={open ? "action-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        MenuListProps={{
          "aria-labelledby": "action-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEditClick();
          }}
        >
          Edit
        </MenuItem>
        {!hideDelete && (
          <MenuItem
            onClick={() => {
              handleClose();
              onDeleteClick();
            }}
          >
            Delete
          </MenuItem>
        )}
        {moreActions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => {
              handleClose();
              action.onClick();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ActionMenu;
