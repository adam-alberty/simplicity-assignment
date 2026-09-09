import type { AnnouncementCategory } from "#/lib/announcements/types";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";

export function CategoriesSelect({
	categories,
	value,
	onChange,
}: {
	categories: AnnouncementCategory[];
	value: string[];
	onChange: (v: string[]) => void;
}) {
	const anchor = useComboboxAnchor();

	const selectedCategories = categories.filter((cat) => value.includes(cat.id));

	return (
		<Combobox
			multiple
			autoHighlight
			items={categories}
			value={selectedCategories}
			onValueChange={(v) => {
				onChange(v.map((cat) => cat.id));
			}}
		>
			<ComboboxChips ref={anchor} className="w-full">
				<ComboboxValue>
					{(values: AnnouncementCategory[]) => (
						<>
							{values.map((cat) => (
								<ComboboxChip key={cat.id}>{cat.name}</ComboboxChip>
							))}
							<ComboboxChipsInput />
						</>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No items found.</ComboboxEmpty>
				<ComboboxList>
					{(item: AnnouncementCategory) => (
						<ComboboxItem key={item.id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
