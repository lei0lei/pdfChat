import React  from 'react';

const MyComponent: React.FC = () => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/test_backend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'test':'test cors',
          }),
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const result = await res.json();
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();


  return (
    <div>
      {/* 在这里渲染你的数据 */}
      
    </div>
  );
};

export default MyComponent;