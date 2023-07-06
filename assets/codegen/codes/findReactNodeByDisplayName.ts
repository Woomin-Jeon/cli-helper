/**
 * @description React 컴포넌트의 displayName을 기반으로 ReactNode를 찾는 함수
 */
export const findReactNodeByDisplayName = (children: ReactNode, name?: string) => {
  const queue: ReactNode[] = [children];

  while (queue.length) {
    const targetNode = queue.shift();

    const validChildren = React.Children.toArray(targetNode).filter((node) => React.isValidElement(node));

    for (let i = 0; i < validChildren.length; i++) {
      const node = validChildren[i];

      if (typeof node !== 'object' || !('props' in node)) {
        continue;
      }

      if (typeof node.type !== 'function' || !('displayName' in node.type) || node.type.displayName !== name) {
        if (node.props.children) {
          queue.push(node.props.children);
        }

        continue;
      }

      return node;
    }
  }

  return null;
};
