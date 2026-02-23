import { useUserStore } from '@/_domain/auth';
import BranchCard from '@/entities/branch/ui/BranchCard';
import { useNavigate } from 'react-router-dom';

const ActiveBranchList = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <p className="px-5 font-sb py-3">{'이용중인 지점'}</p>
      <div className="overflow-y-auto grow">
        <ul className="px-5 space-y-3">
          {(user?.brands || []).map((brand, index) => (
            <li
              key={index}
              className="border border-gray-100 rounded-2xl p-5"
              onClick={() => {
                navigate(`/branch/${brand.b_idx}`);
              }}
            >
              <BranchCard name={brand.b_name} address={brand.addr} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActiveBranchList;
