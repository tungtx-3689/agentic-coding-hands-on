"use client";

import { Dropdown } from "./dropdown";

interface DepartmentDropdownProps {
  departments: Array<{ id: string; name: string }>;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function DepartmentDropdown({
  departments,
  selected,
  onSelect,
}: DepartmentDropdownProps) {
  const selectedDept = departments.find((d) => d.id === selected);
  const triggerLabel = selectedDept ? selectedDept.name : "Phòng ban";

  const trigger = (
    <button
      type="button"
      className="bg-[#101417] border border-[#2e3940] rounded-full px-4 py-2 text-sm text-white cursor-pointer hover:border-[#998c5f] transition-colors duration-150"
    >
      {triggerLabel}
    </button>
  );

  return (
    <Dropdown trigger={trigger}>
      <ul className="max-h-64 overflow-y-auto py-1">
        {selected !== null && (
          <li>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00070c] cursor-pointer transition-colors duration-150"
            >
              Tất cả
            </button>
          </li>
        )}
        {departments.map((dept) => (
          <li key={dept.id}>
            <button
              type="button"
              onClick={() => onSelect(dept.id)}
              className={[
                "w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-[#00070c] transition-colors duration-150",
                dept.id === selected ? "text-[#ffea9e]" : "text-white",
              ].join(" ")}
            >
              {dept.name}
            </button>
          </li>
        ))}
        {departments.length === 0 && (
          <li className="px-4 py-2 text-sm text-[#999999]">
            Không có phòng ban
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
