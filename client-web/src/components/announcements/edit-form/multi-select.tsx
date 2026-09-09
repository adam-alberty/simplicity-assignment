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
}: {
	categories: AnnouncementCategory[];
}) {
	const anchor = useComboboxAnchor();

	return (
		<Combobox
			multiple
			autoHighlight
			items={categories}
			defaultValue={[categories[0]]}
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
