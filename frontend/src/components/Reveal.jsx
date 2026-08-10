import useInView from '../hooks/useInView';

const MAX_DELAY_MS = 300;

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const [ref, isInView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal${isInView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${Math.min(delay, MAX_DELAY_MS)}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
