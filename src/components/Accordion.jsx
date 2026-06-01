import { useId, useState } from "react";

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className = "",
}) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(defaultOpenIds);

  function toggle(id) {
    setOpenIds((current) => {
      const isOpen = current.includes(id);
      if (allowMultiple) {
        return isOpen ? current.filter((value) => value !== id) : [...current, id];
      }
      return isOpen ? [] : [id];
    });
  }

  return (
    <div className={`accordion ${className}`.trim()}>
      {items.map((item, index) => {
        const itemId = item.id ?? `${baseId}-${index}`;
        const buttonId = `${itemId}-button`;
        const panelId = `${itemId}-panel`;
        const isOpen = openIds.includes(itemId);
        return (
          <div className="accordion-item" key={itemId}>
            <h3 className="accordion-heading">
              <button
                id={buttonId}
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(itemId)}
              >
                <span>{item.title || item.question}</span>
                <span className="accordion-icon" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="accordion-panel"
              hidden={!isOpen}
            >
              {item.description && <p>{item.description}</p>}
              {item.answer && <p>{item.answer}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
