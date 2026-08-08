import useInView from '../hooks/useInView';

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const [ref, isInView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal${isInView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
