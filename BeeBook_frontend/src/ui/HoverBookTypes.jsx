import * as HoverCard from "@radix-ui/react-hover-card";
import { useEffect, useState } from "react";
import "../style/HoverBookTypes.scss";
import axios from "axios";
const HoverBookTypes = () => {
  const [allTypes, setAllTypes] = useState([]);

  const SERVER_DOMAIN = "http://localhost:8098";
  useEffect(() => {
    axios.get(`${SERVER_DOMAIN}/type/all`).then((res) => {
      console.log(res.data.content[0].content);
      setAllTypes(res.data.content[0].content);
    });
  }, []);
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <a target="_blank">Thể loại</a>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className="HoverCardContent">
          {allTypes.map((type, i) => (
            <p key={i}>{type.name}</p>
          ))}

          <HoverCard.Arrow className="HoverCardArrow" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default HoverBookTypes;
