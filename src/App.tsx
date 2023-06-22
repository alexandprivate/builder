interface ButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  flavor: 'primary' | 'secondary';
}

const flavors = {
  primary: 'bg-pink-500 hover:bg-pink-700 text-white h-10 px-5 rounded',
  secondary: 'bg-gray-500 hover:bg-gray-700 text-white h-10 px-5 rounded'
};
const Button: React.FC<ButtonProps> = ({ flavor = 'primary', ...restProps }) => {
  return <button className={flavors[flavor]} {...restProps} />;
};

interface TextProps extends React.ComponentProps<'p'> {
  children: React.ReactNode;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}
const Text = (props: TextProps) => {
  const Tag = props.as || 'p';
  return <Tag {...props} />;
};

const COMPONENT = {
  Button,
  Text
};

type ComponentWithProps = {
  Button: ButtonProps;
  Text: TextProps;
};

type Component = {
  [K in keyof ComponentWithProps]?: ComponentWithProps[K];
};

type Section = {
  name?: string;
  style?: string;
  blocks?: {
    style?: string;
    components?: Component[];
  }[];
}[];

interface LemonadeUi {
  title: string;
  description: string;
  url: string;
  image: string;
  sections: Section;
}

const page = {
  title: 'Vite + React',
  description: 'Vite + React + TypeScript + Tailwind CSS',
  url: 'https://vitejs.dev/guide/features.html',
  image: 'https://vitejs.dev/logo.svg',
  sections: [
    {
      style: 'flex flex-col bg-gray-900 text-white p-5',
      blocks: [
        {
          style: 'flex justify-center flex-col text-center text-white p-5',
          components: [
            {
              Text: {
                children: 'Hello there',

                className: 'text-6xl',
                as: 'h1'
              }
            },
            { Text: { children: 'Hello there', className: 'text-lg' } }
          ]
        },

        // another block
        {
          style: 'flex items-center justify-center gap-3 text-white p-5',
          components: [
            {
              Button: {
                children: 'Primary Call to action',
                flavor: 'primary',
                onClick: () => console.log('primary cta click it')
              }
            },
            { Button: { children: 'Secondary Call to action', flavor: 'secondary' } }
          ]
        }
      ]
    },
    {
      style: 'flex bg-gray-800 text-white p-5',
      blocks: [
        {
          style: 'w-full flex justify-center flex-col items-center',
          components: [
            {
              Text: {
                children: 'Another section tile',
                className: 'text-3xl',
                as: 'h2'
              }
            },
            { Text: { children: 'Another text Here', className: 'text-lg' } }
          ]
        }
      ]
    },
    {
      style: 'flex bg-gray-200 text-teal-950 p-5',
      blocks: [
        {
          style: 'w-full',
          components: [
            {
              Text: {
                className: 'text-center',
                children: 'Another section tile'
              }
            }
          ]
        }
      ]
    }
  ]
} satisfies LemonadeUi;

const Builder: React.FC<{ uiConfig: LemonadeUi }> = ({ uiConfig }) => {
  return (
    <>
      {/* we can use helmet here to set SEO related stuff from uiConfig - ignoring for now */}

      {uiConfig.sections.map((section, index) => {
        return (
          <section key={`${index}-section`} className={section.style}>
            {section.blocks?.map((block, index) => {
              return (
                <div key={`${index}-section-${index}-block`} className={block.style}>
                  <>
                    {block.components?.map((componentDefinition, index) => {
                      const [component] = Object.entries(componentDefinition);
                      const Component = COMPONENT[component[0] as keyof ComponentWithProps];
                      const props = component[1];
                      const { children, ...restProps } = props;

                      return children != null ? (
                        <Component key={index} {...restProps}>
                          {children}
                        </Component>
                      ) : (
                        <Component key={index} {...restProps} />
                      );
                    })}
                  </>
                </div>
              );
            })}
          </section>
        );
      })}
    </>
  );
};

function App() {
  return <Builder uiConfig={page} />;
}

export default App;
