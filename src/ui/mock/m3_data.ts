import type { ComponentNode } from '../../common/schema';

export const M3_MOCK_COMPONENTS: ComponentNode[] = [
    // 1. Buttons (Various Types)
    {
        atomType: "BUTTON",
        name: "Button/Filled",
        variant: "FILLED",
        label: "Filled Button",
        icon: "LEADING",
        fill: "sys-bg-primary"
    },
    {
        atomType: "BUTTON",
        name: "Button/Tonal",
        variant: "TONAL",
        label: "Tonal Button",
        icon: "NONE",
        fill: "sys-bg-secondary" // Assuming we have this
    },

    // 2. TextField (Outlined)
    {
        atomType: "TEXT_FIELD",
        name: "Input/Outlined",
        variant: "OUTLINED",
        label: "Email Address",
        text: "user@example.com",
        supportingText: "Required field",
        trailingIcon: "yes"
    },

    // 3. Chip (Filter)
    {
        atomType: "CHIP",
        name: "Chip/Filter",
        variant: "FILTER",
        label: "Filter By",
        icon: "LEADING",
        selected: true,
        fill: "sys-bg-surface-variant"
    },

    // 4. Card (Elevated with Content)
    {
        atomType: "CARD",
        name: "Card/Elevated",
        variant: "ELEVATED",
        fill: "sys-bg-surface",
        effect: "elevation-sm",
        padding: 16,
        children: [
            {
                type: "TEXT",
                name: "Header",
                content: "Card Title",
                style: "Heading/H1",
                color: "sys-text-main"
            },
            {
                atomType: "BUTTON",
                name: "Action",
                variant: "TEXT",
                label: "Read More"
            }
        ]
    }
];
