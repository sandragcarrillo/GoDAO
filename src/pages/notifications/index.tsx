import { useEffect, useState, useContext, useCallback } from 'react';
import { Web3Context } from '../../context';
import * as PushAPI from '@pushprotocol/restapi';
import { NotificationItem, chainNameType } from '@pushprotocol/uiweb';

const Notifications = () => {
  const { account } = useContext<any>(Web3Context);
  const [notifs, setNotifs] = useState<PushAPI.ParsedResponseType[]>();
  const [showSidebar, setShowSidebar] = useState(false); // Agrega aquí el estado para controlar la visibilidad de la barra lateral

  const loadNotifications = useCallback(async () => {
    try {
      const feeds = await PushAPI.user.getFeeds({
        user: account,
        limit: 50,
      });
      console.log('feeds: ', feeds);
      setNotifs(feeds);
    } catch (e) {
      console.error(e);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      loadNotifications();
    }
  }, [loadNotifications, account]);

  return (
    <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
      <div className="sidebar-content">
        <p>Notifications:</p>
        <div>
          {notifs ? (
            <div>
              {notifs.map((oneNotification, i) => {
                const {
                  cta,
                  title,
                  message,
                  app,
                  icon,
                  image,
                  url,
                  blockchain,
                  secret,
                  notification,
                } = oneNotification;

                return (
                  <NotificationItem
                    key={`notif-${i}`}
                    notificationTitle={secret ? notification['title'] : title}
                    notificationBody={secret ? notification['body'] : message}
                    cta={cta}
                    app={app}
                    icon={icon}
                    image={image}
                    url={url}
                    theme={'dark'}
                    chainName={blockchain as chainNameType}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
