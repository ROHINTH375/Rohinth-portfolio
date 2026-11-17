import { Children, cloneElement, isValidElement } from 'react';
import useReveal from '../hooks/useReveal';

// A page section that fades in on scroll.
export default function Section({ id, className = '', innerClassName = '', children }) {
  const [ref, visible] = useReveal();
  return (
    <section id={id} className={className}>
      <div ref={ref} className={`wrap reveal ${visible ? 'in' : ''} ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

// Wraps a grid/list so its children animate in one after another.
export function Stagger({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`${className} stagger`}>
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child, {
              style: { ...(child.props.style || {}), transitionDelay: `${i * 90 + 100}ms` },
            })
          : child
      )}
    </Tag>
  );
}

export function SectionHeading({ eyebrow, title, sub }) {
  return (
    <>
      <div className="eyebrow">// {eyebrow}</div>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </>
  );
}
